import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Ism kamida 2 ta belgidan iborat bo'lishi kerak" }),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email({ message: "Noto'g'ri email formati" }).optional().or(z.literal("")),
  password: z.string().min(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" }),
}).refine(data => {
  const hasPhone = data.phone && data.phone.trim().length > 0;
  const hasEmail = data.email && data.email.trim().length > 0;
  return hasPhone || hasEmail;
}, {
  message: "Telefon raqami yoki email'dan kamida bittasi kiritilishi shart",
  path: ["phone"],
});

export const loginSchema = z.object({
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email({ message: "Noto'g'ri email formati" }).optional().or(z.literal("")),
  password: z.string().min(1, { message: "Parol kiritilishi shart" }),
}).refine(data => {
  const hasPhone = data.phone && data.phone.trim().length > 0;
  const hasEmail = data.email && data.email.trim().length > 0;
  return hasPhone || hasEmail;
}, {
  message: "Tizimga kirish uchun telefon raqami yoki email kiritilishi shart",
  path: ["phone"],
});
