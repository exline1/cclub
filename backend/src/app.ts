import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ZodError } from "zod";
import authRoutes from "./modules/auth/routes";
import computerRoutes from "./modules/computers/routes";
import orderRoutes from "./modules/orders/routes";
import productRoutes from "./modules/products/routes";
import customerRoutes from "./modules/customers/routes";
import shiftRoutes from "./modules/shifts/routes";
import settingRoutes from "./modules/settings/routes";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Module skeleton routes
app.use("/api/auth", authRoutes);
app.use("/api/computers", computerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/settings", settingRoutes);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Global error handling middleware (strictly typed, no 'any')
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Global error handler:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: err.issues.map(e => e.message).join(", "),
      },
    });
  }

  // Handle specific known business logic error messages
  const message = err.message || "Internal Server Error";
  let status = err.status || 500;

  if (message.includes("noto'g'ri") || message.includes("topilmadi") || message.includes("o'tilmagan")) {
    status = 401;
  } else if (message.includes("allaqachon ro'yxatdan o'tgan")) {
    status = 400;
  } else if (message.includes("Ruxsat etilmagan") || message.includes("PENDING_APPROVAL") || message.includes("APPLICATION_REJECTED")) {
    status = 403;
  }

  res.status(status).json({
    error: {
      message,
    },
  });
});

export default app;
