import { Request, Response, NextFunction } from "express";
import { CustomerService } from "./service";
import { z } from "zod";

export class CustomerController {
  static async getAllCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CustomerService.getAllCustomers();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .uuid({ message: "Mijoz ID uuid bo'lishi kerak" })
        .parse(req.params.id);

      const result = await CustomerService.getCustomerDetail(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
