import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

interface DecodedToken {
  id: string;
  role: Role;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: {
        message: "Avtorizatsiyadan o'tilmagan",
      },
    });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_ACCESS_SECRET || "mock_access_secret_key_12345";

  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      error: {
        message: "Token noto'g'ri",
      },
    });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        message: "Avtorizatsiyadan o'tilmagan",
      },
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: {
        message: "Ruxsat etilmagan",
      },
    });
  }

  next();
};
