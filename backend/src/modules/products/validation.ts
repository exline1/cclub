import { z } from "zod";
import { ProductCategory } from "@prisma/client";

export const createProductSchema = z.object({
  name: z.string().min(1, { message: "Nomi kiritilishi shart" }),
  category: z.nativeEnum(ProductCategory, { message: "Noto'g'ri kategoriya" }),
  price: z.number().int().positive({ message: "Narx musbat butun son bo'lishi kerak" }),
  stock: z.number().int().nonnegative({ message: "Soni manfiy bo'lmasligi kerak" }),
  imageUrl: z.string().url({ message: "Noto'g'ri rasm URL formati" }).optional().nullable().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();
