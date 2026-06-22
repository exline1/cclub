import { Router } from "express";
import { SettingController } from "./controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

// Public route (useful for Landing Page to fetch club info)
router.get("/", SettingController.getAllSettings);

// Admin-only route to update settings
router.put("/:key", requireAuth, requireAdmin, SettingController.upsertSetting);

export default router;
