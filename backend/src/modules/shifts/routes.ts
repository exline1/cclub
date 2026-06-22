import { Router } from "express";
import { ShiftController } from "./controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

router.post("/open", requireAuth, requireAdmin, ShiftController.openShift);
router.post("/:id/close", requireAuth, requireAdmin, ShiftController.closeShift);
router.get("/current", requireAuth, requireAdmin, ShiftController.getCurrentShift);
router.get("/history", requireAuth, requireAdmin, ShiftController.getShiftHistory);

export default router;
