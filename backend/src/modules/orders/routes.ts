import { Router } from "express";
import { OrderController } from "./controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

// User placed orders (needs authentication)
router.post("/", requireAuth, OrderController.createOrder);

// Admin-only management routes
router.get("/", requireAuth, requireAdmin, OrderController.getActiveOrders);
router.patch("/:id/status", requireAuth, requireAdmin, OrderController.updateStatus);

export default router;
