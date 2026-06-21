import { z } from "zod";

export const startSessionSchema = z.object({
  computerId: z.string().uuid({ message: "computerId uuid bo'lishi kerak" }),
  durationMinutes: z.number().int().positive({ message: "durationMinutes musbat butun son bo'lishi kerak" }),
  customerName: z.string().optional().nullable(),
});

export const extendSessionSchema = z.object({
  sessionId: z.string().uuid({ message: "sessionId uuid bo'lishi kerak" }),
  additionalMinutes: z.number().int().positive({ message: "additionalMinutes musbat butun son bo'lishi kerak" }),
});

export const changeComputerSchema = z.object({
  sessionId: z.string().uuid({ message: "sessionId uuid bo'lishi kerak" }),
  newComputerId: z.string().uuid({ message: "newComputerId uuid bo'lishi kerak" }),
});
