import { Router } from "express";
import { CustomerController } from "./controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

router.get("/", requireAuth, requireAdmin, CustomerController.getAllCustomers);
router.get("/:id", requireAuth, requireAdmin, CustomerController.getCustomerDetail);

export default router;
