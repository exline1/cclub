import { Request, Response, NextFunction } from "express";
import { ProductService } from "./service";
import { createProductSchema, updateProductSchema } from "./validation";
import { z } from "zod";

export class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getAll();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z.string().uuid({ message: "Mahsulot ID uuid bo'lishi kerak" }).parse(req.params.id);
      const result = await ProductService.getById(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createProductSchema.parse(req.body);
      const result = await ProductService.create(validated);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z.string().uuid({ message: "Mahsulot ID uuid bo'lishi kerak" }).parse(req.params.id);
      const validated = updateProductSchema.parse(req.body);
      const result = await ProductService.update(id, validated);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z.string().uuid({ message: "Mahsulot ID uuid bo'lishi kerak" }).parse(req.params.id);
      const result = await ProductService.delete(id);
      return res.status(200).json({
        message: "Mahsulot muvaffaqiyatli o'chirildi",
        product: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
