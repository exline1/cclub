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
    const secret = process.env.JWT_ACCESS_SECRET || "mock_access_secret_key_12345";
    return jwt.sign({ id: userId, role }, secret, { expiresIn: "15m" });
  }

  static generateRefreshToken(userId: string): string {
    const secret = process.env.JWT_REFRESH_SECRET || "mock_refresh_secret_key_12345";
    return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
  }

  static async refreshAccessToken(refreshToken: string): Promise<string> {
    const secret = process.env.JWT_REFRESH_SECRET || "mock_refresh_secret_key_12345";
    
    try {
      const decoded = jwt.verify(refreshToken, secret) as { id: string };
      
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
