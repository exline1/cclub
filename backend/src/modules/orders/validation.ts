import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const createOrderSchema = z.object({
  sessionId: z.string().uuid({ message: "sessionId uuid bo'lishi kerak" }).optional().nullable(),
  computerNumber: z.number().int().positive({ message: "computerNumber musbat butun son bo'lishi kerak" }).optional().nullable(),
  items: z.array(
    z.object({
      productId: z.string().uuid({ message: "productId uuid bo'lishi kerak" }),
      qty: z.number().int().positive({ message: "qty musbat butun son bo'lishi kerak" }),
    })
  ).min(1, { message: "Kamida bitta mahsulot bo'lishi shart" }),
}).refine(data => {
  const hasSessionId = data.sessionId && data.sessionId.trim().length > 0;
  const hasComputerNumber = data.computerNumber !== undefined && data.computerNumber !== null;
  return hasSessionId || hasComputerNumber;
}, {
  message: "Session ID yoki kompyuter raqami kiritilishi shart",
  path: ["sessionId"],
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus, { message: "Noto'g'ri buyurtma statusi" }),
});
