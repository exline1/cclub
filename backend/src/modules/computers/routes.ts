import { Router } from "express";
import { ComputerController } from "./controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

// Public routes for checking availability
router.get("/", ComputerController.getAllComputers);
router.get("/:id", ComputerController.getComputerById);

// Admin-only session control routes
router.post("/start", requireAuth, requireAdmin, ComputerController.startSession);
router.post("/stop", requireAuth, requireAdmin, ComputerController.stopSession);
router.post("/extend", requireAuth, requireAdmin, ComputerController.extendSession);
router.post("/change", requireAuth, requireAdmin, ComputerController.changeComputer);

export default router;
