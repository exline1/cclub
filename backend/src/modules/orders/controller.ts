import { Request, Response, NextFunction } from "express";
import { OrderService } from "./service";
import { createOrderSchema, updateOrderStatusSchema } from "./validation";
import { z } from "zod";

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createOrderSchema.parse(req.body);
      const result = await OrderService.createOrder(validated, req.user?.id);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getActiveOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.getActiveOrders();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z.string().uuid({ message: "Buyurtma ID uuid bo'lishi kerak" }).parse(req.params.id);
      const { status } = updateOrderStatusSchema.parse(req.body);
      const result = await OrderService.updateOrderStatus(id, status, req.user?.id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
