import prisma from "../../lib/prisma";
import { Role } from "@prisma/client";

export class CustomerService {
  static async getAllCustomers() {
    const customers = await prisma.user.findMany({
      where: { role: Role.CUSTOMER },
      include: {
        sessions: {
          include: {
            orders: {
              where: { status: { not: "CANCELLED" } },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return customers.map((customer) => {
      const sessionsCount = customer.sessions.length;

      // Calculate totalSpent: sessions totalAmount + non-cancelled orders total
      const sessionsTotal = customer.sessions.reduce((sum, s) => sum + (s.totalAmount ?? 0), 0);
      const ordersTotal = customer.sessions.reduce((sum, s) => {
        return sum + s.orders.reduce((oSum, o) => oSum + o.total, 0);
      }, 0);
      const totalSpent = sessionsTotal + ordersTotal;

      // Calculate lastVisit as the newest startedAt of their sessions
      let lastVisit: Date | null = null;
      if (customer.sessions.length > 0) {
        const dates = customer.sessions.map((s) => s.startedAt.getTime());
        lastVisit = new Date(Math.max(...dates));
      }

      const { passwordHash, ...safeUser } = customer;
      return {
        ...safeUser,
        sessionsCount,
        totalSpent,
        lastVisit,
      };
    });
  }

  static async getCustomerDetail(id: string) {
    const customer = await prisma.user.findFirst({
      where: { id, role: Role.CUSTOMER },
    });

    if (!customer) {
      throw new Error("Mijoz topilmadi");
    }

    const sessions = await prisma.session.findMany({
      where: { userId: id },
      include: { computer: true },
      orderBy: { startedAt: "desc" },
    });

    const orders = await prisma.order.findMany({
      where: {
        session: { userId: id },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const { passwordHash, ...safeUser } = customer;
    return {
      ...safeUser,
      sessions,
      orders,
    };
  }
}
