import { Request, Response, NextFunction } from "express";
import { ShiftService } from "./service";
import { z } from "zod";

export class ShiftController {
  static async openShift(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("Avtorizatsiyadan o'tilmagan");
      }

      const result = await ShiftService.openShift(userId);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async closeShift(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .uuid({ message: "Shift ID uuid bo'lishi kerak" })
        .parse(req.params.id);

      const result = await ShiftService.closeShift(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentShift(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ShiftService.getCurrentShift();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getShiftHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ShiftService.getShiftHistory();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
