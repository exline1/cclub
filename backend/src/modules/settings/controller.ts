import { Request, Response, NextFunction } from "express";
import { SettingService } from "./service";
import { z } from "zod";

export class SettingController {
  static async getAllSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SettingService.getAllSettings();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async upsertSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const key = z
        .string()
        .min(1, { message: "Sozlama kaliti bo'sh bo'lmasligi kerak" })
        .parse(req.params.key);

      const value = req.body.value !== undefined ? req.body.value : req.body;

      // Basic validation: value shouldn't be undefined
      if (value === undefined) {
        return res.status(400).json({
          error: {
            message: "Sozlama qiymati jo'natilishi shart",
          },
        });
      }

      const result = await SettingService.upsertSetting(key, value);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
