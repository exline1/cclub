import prisma from "../../lib/prisma";
import { ProductService } from "../products/service";
import { createOrderSchema } from "./validation";
import { z } from "zod";
import { OrderStatus } from "@prisma/client";
import { getIo } from "../../lib/socket";

type CreateOrderInput = z.infer<typeof createOrderSchema>;

export class OrderService {
  static async getActiveOrders() {
    return prisma.order.findMany({
      where: {
        status: {
          in: [OrderStatus.PENDING, OrderStatus.PREPARING],
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Buyurtma topilmadi");
    }

    return order;
  }

  static async createOrder(data: CreateOrderInput, actorId?: string) {
    let sessionId = data.sessionId || null;
    let computerNumber = data.computerNumber || null;

    if (sessionId) {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { computer: true },
      });
      if (!session) {
        throw new Error("Mijoz sessiyasi topilmadi");
      }
      if (session.status !== "ACTIVE") {
        throw new Error("Sessiya faol emas");
      }
      computerNumber = session.computer.number;
    } else if (computerNumber) {
      const computer = await prisma.computer.findUnique({
        where: { number: computerNumber },
      });
      if (!computer) {
        throw new Error("Kompyuter topilmadi");
      }
      const activeSession = await prisma.session.findFirst({
        where: { computerId: computer.id, status: "ACTIVE" },
      });
      if (activeSession) {
        sessionId = activeSession.id;
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData = [];

      for (const item of data.items) {
        // deduct stock (uses delta = -qty). If stock is insufficient, updateStock will throw error.
        const product = await ProductService.updateStock(item.productId, -item.qty, tx);
        
        total += product.price * item.qty;
        
        orderItemsData.push({
          productId: item.productId,
          qty: item.qty,
          priceAtOrder: product.price,
        });
      }

      const newOrder = await tx.order.create({
        data: {
          sessionId,
          computerNumber: computerNumber!,
          status: OrderStatus.PENDING,
          total,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // Log activity
      await tx.activityLog.create({
        data: {
          actorId: actorId || null,
          action: "order_created",
          targetType: "order",
          targetId: newOrder.id,
        },
      });

      return newOrder;
    });

    // Emit real-time socket events
    try {
      const io = getIo();
      io.to("admin-room").emit("order:new", { order });
    } catch (err: any) {
      console.warn("Real-time emit failed or Socket.io not initialized:", err.message);
    }

    return order;
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus, actorId?: string) {
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new Error("Buyurtma topilmadi");
      }

      // If status is transitioning to CANCELLED, return stock
      if (status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
        for (const item of order.items) {
          await ProductService.updateStock(item.productId, item.qty, tx);
        }
      }

      // If status is transitioning FROM CANCELLED back to something active, re-deduct stock
      if (order.status === OrderStatus.CANCELLED && status !== OrderStatus.CANCELLED) {
        for (const item of order.items) {
          await ProductService.updateStock(item.productId, -item.qty, tx);
        }
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // Log activity
      await tx.activityLog.create({
        data: {
          actorId: actorId || null,
          action: "order_status_updated",
          targetType: "order",
          targetId: orderId,
        },
      });

      return updated;
    });

    // Emit real-time events
    try {
      const io = getIo();
      io.to("admin-room").emit("order:status_changed", {
        orderId: updatedOrder.id,
        status: updatedOrder.status,
        order: updatedOrder,
      });

      if (updatedOrder.sessionId) {
        io.to(`session-${updatedOrder.sessionId}`).emit("order:status_changed", {
          orderId: updatedOrder.id,
          status: updatedOrder.status,
        });
      }
    } catch (err: any) {
      console.warn("Real-time emit failed or Socket.io not initialized:", err.message);
    }

    return updatedOrder;
  }
}
