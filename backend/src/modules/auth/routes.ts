import { Router } from "express";
import { AuthController } from "./controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.get("/me", requireAuth, AuthController.me);

router.post("/send-telegram-code", AuthController.sendTelegramCode);
router.post("/verify-telegram-code", AuthController.verifyTelegramCode);

export default router;
