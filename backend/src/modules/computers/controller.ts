import { Request, Response, NextFunction } from "express";
import { ComputerService } from "./service";
import { startSessionSchema, extendSessionSchema, changeComputerSchema } from "./validation";
import { z } from "zod";

export class ComputerController {
  static async getAllComputers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ComputerService.getAllComputers();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getComputerById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z.string().uuid({ message: "Kompyuter ID uuid bo'lishi kerak" }).parse(req.params.id);
      const result = await ComputerService.getComputerById(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async startSession(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = startSessionSchema.parse(req.body);
      const result = await ComputerService.startSession(validated, req.user?.id);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async stopSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = z.object({
        sessionId: z.string().uuid({ message: "sessionId uuid bo'lishi kerak" }),
      }).parse(req.body);
      
      const result = await ComputerService.stopSession(sessionId, req.user?.id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async extendSession(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = extendSessionSchema.parse(req.body);
      const result = await ComputerService.extendSession(validated, req.user?.id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async changeComputer(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = changeComputerSchema.parse(req.body);
      const result = await ComputerService.changeComputer(validated, req.user?.id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}