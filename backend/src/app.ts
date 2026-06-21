import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
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
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

export default app;
