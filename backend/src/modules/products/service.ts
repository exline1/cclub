import prisma from "../../lib/prisma";
import { createProductSchema } from "./validation";
import { z } from "zod";
import { Prisma } from "@prisma/client";

type CreateProductInput = z.infer<typeof createProductSchema>;
type UpdateProductInput = Partial<CreateProductInput>;

export class ProductService {
  static async getAll() {
    return prisma.product.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new Error("Mahsulot topilmadi");
    }
    return product;
  }

  static async create(data: CreateProductInput) {
    return prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  static async update(id: string, data: UpdateProductInput) {
    await this.getById(id); // Throws if not found

    return prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl === "" ? null : data.imageUrl,
        isActive: data.isActive,
      },
    });
  }

  static async delete(id: string) {
    await this.getById(id); // Throws if not found

    try {
      return await prisma.product.delete({
        where: { id },
      });
    } catch (error: any) {
      // If product is referenced in order items, we cannot delete it due to foreign keys.
      // Instead, we throw a user-friendly error.
      if (error.code === "P2003") {
        throw new Error("Mahsulot buyurtmalarda ishlatilgan, uni o'chirish imkonsiz. Faqat nofaol qilish mumkin.");
      }
      throw error;
    }
  }

  /**
   * Updates stock by adding delta (can be positive or negative).
   * Throws an error if stock falls below zero.
   * Accepts optional transaction client.
   */
  static async updateStock(id: string, delta: number, tx: Prisma.TransactionClient = prisma) {
    const product = await tx.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Mahsulot topilmadi");
    }

    const newStock = product.stock + delta;
    if (newStock < 0) {
      throw new Error(`Mahsulot (${product.name}) zaxirasi yetarli emas. Hozirda: ${product.stock} ta bor.`);
    }

    return tx.product.update({
      where: { id },
      data: { stock: newStock },
    });
  }
}
