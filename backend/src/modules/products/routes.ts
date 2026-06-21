import { Router } from "express";
import { ProductController } from "./controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

// Public routes
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);

// Admin restricted routes
router.post("/", requireAuth, requireAdmin, ProductController.create);
router.put("/:id", requireAuth, requireAdmin, ProductController.update);
router.delete("/:id", requireAuth, requireAdmin, ProductController.delete);

export default router;
