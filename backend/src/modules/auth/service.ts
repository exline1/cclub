import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import { registerSchema, loginSchema } from "./validation";
import { z } from "zod";

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export class AuthService {
  private static readonly saltRounds = 10;

  static async register(data: RegisterInput) {
    const { name, phone, email, password } = data;

    // Check if phone or email already registered
    if (phone && phone.trim().length > 0) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        throw new Error("Bu telefon/email allaqachon ro'yxatdan o'tgan");
      }
    }

    if (email && email.trim().length > 0) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        throw new Error("Bu telefon/email allaqachon ro'yxatdan o'tgan");
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, this.saltRounds);

    // Create user in DB
    const user = await prisma.user.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        passwordHash,
        role: "CUSTOMER",
      },
    });

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    // Return user (without password) and tokens
    const { passwordHash: _, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  static async login(data: LoginInput) {
    const { phone, email, password } = data;

    let user = null;

    if (email && email.trim().length > 0) {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } else if (phone && phone.trim().length > 0) {
      user = await prisma.user.findUnique({
        where: { phone },
      });
    }

    if (!user) {
      throw new Error("Login yoki parol noto'g'ri");
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new Error("Login yoki parol noto'g'ri");
    }

    if (user.role === "CLUB_OWNER") {
      const club = await prisma.club.findFirst({ where: { ownerId: user.id } });
      if (club) {
        if (club.approvalStatus === "PENDING") {
          const error: any = new Error("PENDING_APPROVAL");
          error.status = 403;
          throw error;
        }
        if (club.approvalStatus === "REJECTED") {
          const error: any = new Error(`APPLICATION_REJECTED:${club.rejectionReason || ""}`);
          error.status = 403;
          throw error;
        }
      }
    }

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    const { passwordHash: _, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  static generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
  }

  static async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new Error("Foydalanuvchi topilmadi");
      }

      return this.generateAccessToken(user.id, user.role);
    } catch (err) {
      throw new Error("Token noto'g'ri");
    }
  }
}
