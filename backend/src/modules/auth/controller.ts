import { Request, Response, NextFunction } from "express";
import { AuthService } from "./service";
import { registerSchema, loginSchema } from "./validation";
import prisma from "../../lib/prisma";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await AuthService.register(validated);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      });

      return res.status(201).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.login(validated);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      });

      return res.status(200).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          error: {
            message: "Token noto'g'ri",
          },
        });
      }

      const accessToken = await AuthService.refreshAccessToken(refreshToken);
      return res.status(200).json({
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return res.status(200).json({
        message: "Logged out",
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            message: "Avtorizatsiyadan o'tilmagan",
          },
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!user) {
        return res.status(401).json({
          error: {
            message: "Foydalanuvchi topilmadi",
          },
        });
      }

      const { passwordHash: _, ...safeUser } = user;
      return res.status(200).json(safeUser);
    } catch (error) {
      next(error);
    }
  }

  static async sendTelegramCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = req.body;
      if (!phone) return res.status(400).json({ error: "Telefon raqam kiritilishi shart" });

      const cleanPhone = phone.replace(/[\s()-]/g, "");

      // 1. Check if we have the chat_id from cache or DB
      const { phoneToChatIdCache } = await import("../../telegram/bot");
      let chatId = phoneToChatIdCache[cleanPhone];

      if (!chatId) {
        // Look up in DB
        const existingUser = await prisma.user.findFirst({ where: { phone: cleanPhone } });
        if (existingUser && existingUser.telegramChatId) {
          chatId = existingUser.telegramChatId;
        }
      }

      if (!chatId) {
        return res.status(400).json({
          error: "Siz Telegram botga kirmagansiz yoki kontaktingizni ulashmagansiz. Iltimos botga ulaning.",
        });
      }

      // Check rate limit: 1 minute cooldown
      const lastCode = await prisma.phoneVerification.findFirst({
        where: { phone: cleanPhone },
        orderBy: { createdAt: "desc" },
      });

      if (lastCode && new Date().getTime() - lastCode.createdAt.getTime() < 60000) {
        return res.status(429).json({ error: "Iltimos, 1 daqiqa kuting." });
      }

      // Generate 6 digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      await prisma.phoneVerification.create({
        data: {
          phone: cleanPhone,
          code,
          telegramChatId: chatId,
          expiresAt,
        },
      });

      // Send via Telegram
      const { bot } = await import("../../telegram/bot");
      if (bot) {
        await bot.telegram.sendMessage(
          chatId,
          `cClub tasdiqlash kodingiz: ${code}\n\nKod 5 daqiqa amal qiladi. Hech kimga bermang.`
        );
      } else {
        // Fallback or log if bot is not running
        console.log(`Telegram bot o'chiq, lekim kod yaratildi: ${code}`);
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  static async verifyTelegramCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, code } = req.body;
      const cleanPhone = phone?.replace(/[\s()-]/g, "");

      if (!cleanPhone || !code) return res.status(400).json({ error: "Telefon yoki kod yo'q" });

      const record = await prisma.phoneVerification.findFirst({
        where: { phone: cleanPhone, verified: false },
        orderBy: { createdAt: "desc" },
      });

      if (!record || record.expiresAt < new Date()) {
        return res.status(400).json({ error: "Kod topilmadi yoki muddati tugagan." });
      }

      if (record.attempts >= 5) {
        return res.status(429).json({ error: "Urinishlar soni tugadi. Qaytadan kod so'rang." });
      }

      if (record.code !== code) {
        await prisma.phoneVerification.update({
          where: { id: record.id },
          data: { attempts: { increment: 1 } },
        });
        return res.status(400).json({ error: "Kod noto'g'ri." });
      }

      await prisma.phoneVerification.update({
        where: { id: record.id },
        data: { verified: true },
      });

      // Update user if they exist
      await prisma.user.updateMany({
        where: { phone: cleanPhone },
        data: { phoneVerified: true, telegramChatId: record.telegramChatId },
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
