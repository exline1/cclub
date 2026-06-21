import prisma from "../../lib/prisma";
import { startSessionSchema, extendSessionSchema, changeComputerSchema } from "./validation";
import { z } from "zod";
import { getIo } from "../../lib/socket";

type StartSessionInput = z.infer<typeof startSessionSchema>;
type ExtendSessionInput = z.infer<typeof extendSessionSchema>;
type ChangeComputerInput = z.infer<typeof changeComputerSchema>;

export class ComputerService {
  static async getAllComputers() {
    return prisma.computer.findMany({
      include: {
        sessions: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
      orderBy: { number: "asc" },
    });
  }

  static async getComputerById(id: string) {
    const computer = await prisma.computer.findUnique({
      where: { id },
      include: {
        sessions: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    });

    if (!computer) {
      throw new Error("Kompyuter topilmadi");
    }

    return computer;
  }

  static async startSession(data: StartSessionInput, actorId?: string) {
    const { computerId, durationMinutes, customerName } = data;

    const computer = await prisma.computer.findUnique({
      where: { id: computerId },
    });

    if (!computer) {
      throw new Error("Kompyuter topilmadi");
    }

    if (computer.status !== "FREE") {
      throw new Error("Kompyuter band");
    }

    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

    const session = await prisma.$transaction(async (tx) => {
      // 1. Create Session
      const sess = await tx.session.create({
        data: {
          computerId,
          userId: actorId || null,
          customerName: customerName || null,
          startedAt,
          endsAt,
          status: "ACTIVE",
        },
      });

      // 2. Update Computer Status to OCCUPIED
      await tx.computer.update({
        where: { id: computerId },
        data: { status: "OCCUPIED" },
      });

      // 3. Log Activity
      await tx.activityLog.create({
        data: {
          actorId: actorId || null,
          action: "session_started",
          targetType: "computer",
          targetId: computerId,
        },
      });

      return sess;
    });

    try {
      const io = getIo();
      io.to("admin-room").emit("computer:status_changed", {
        computerId,
        status: "OCCUPIED",
        session: {
          id: session.id,
          startedAt: session.startedAt,
          endsAt: session.endsAt,
          customerName: session.customerName,
        },
      });
      io.to(`pc-${computerId}`).emit("pc:unlock", {
        sessionId: session.id,
        endsAt: session.endsAt,
      });
    } catch (err: any) {
      console.warn("Real-time emit failed or Socket.io not initialized:", err.message);
    }

    return session;
  }

  static async stopSession(sessionId: string, actorId?: string) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { computer: true },
    });

    if (!session) {
      throw new Error("Sessiya topilmadi");
    }

    if (session.status !== "ACTIVE") {
      throw new Error("Sessiya faol emas");
    }

    const endedAt = new Date();
    const elapsedMs = endedAt.getTime() - session.startedAt.getTime();
    const elapsedMinutes = Math.max(1, elapsedMs / (60 * 1000));
    const totalAmount = Math.round((elapsedMinutes * session.computer.hourlyRate) / 60);

    const updatedSession = await prisma.$transaction(async (tx) => {
      // 1. Update Session status, endsAt and totalAmount
      const sess = await tx.session.update({
        where: { id: sessionId },
        data: {
          status: "COMPLETED",
          endsAt: endedAt,
          totalAmount,
        },
      });

      // 2. Update Computer Status to FREE
      await tx.computer.update({
        where: { id: session.computerId },
        data: { status: "FREE" },
      });

      // 3. Log Activity
      await tx.activityLog.create({
        data: {
          actorId: actorId || null,
          action: "session_stopped",
          targetType: "computer",
          targetId: session.computerId,
        },
      });

      return sess;
    });

    try {
      const io = getIo();
      io.to("admin-room").emit("computer:status_changed", {
        computerId: session.computerId,
        status: "FREE",
        session: null,
      });
      io.to(`pc-${session.computerId}`).emit("pc:lock");
    } catch (err: any) {
      console.warn("Real-time emit failed or Socket.io not initialized:", err.message);
    }

    return updatedSession;
  }

  static async extendSession(data: ExtendSessionInput, actorId?: string) {
    const { sessionId, additionalMinutes } = data;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error("Sessiya topilmadi");
    }

    if (session.status !== "ACTIVE") {
      throw new Error("Sessiya faol emas");
    }

    const currentEndsAt = new Date(session.endsAt);
    const newEndsAt = new Date(currentEndsAt.getTime() + additionalMinutes * 60 * 1000);

    const updatedSession = await prisma.$transaction(async (tx) => {
      // 1. Update Session endsAt
      const sess = await tx.session.update({
        where: { id: sessionId },
        data: {
          endsAt: newEndsAt,
        },
      });

      // 2. Adjust computer status based on new timer limits
      const now = new Date();
      const timeLeftMs = newEndsAt.getTime() - now.getTime();
      const newStatus = timeLeftMs < 10 * 60 * 1000 ? "ENDING_SOON" : "OCCUPIED";

      await tx.computer.update({
        where: { id: session.computerId },
        data: { status: newStatus },
      });

      // 3. Log Activity
      await tx.activityLog.create({
        data: {
          actorId: actorId || null,
          action: "session_extended",
          targetType: "computer",
          targetId: session.computerId,
        },
      });

      return sess;
    });

    try {
      const io = getIo();
      const timeLeftMs = updatedSession.endsAt.getTime() - new Date().getTime();
      const newStatus = timeLeftMs < 10 * 60 * 1000 ? "ENDING_SOON" : "OCCUPIED";
      io.to("admin-room").emit("computer:status_changed", {
        computerId: session.computerId,
        status: newStatus,
        session: {
          id: updatedSession.id,
          startedAt: updatedSession.startedAt,
          endsAt: updatedSession.endsAt,
          customerName: updatedSession.customerName,
        },
      });
      io.to(`pc-${session.computerId}`).emit("pc:unlock", {
        sessionId: updatedSession.id,
        endsAt: updatedSession.endsAt,
      });
    } catch (err: any) {
      console.warn("Real-time emit failed or Socket.io not initialized:", err.message);
    }

    return updatedSession;
  }

  static async changeComputer(data: ChangeComputerInput, actorId?: string) {
    const { sessionId, newComputerId } = data;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error("Sessiya topilmadi");
    }

    if (session.status !== "ACTIVE") {
      throw new Error("Sessiya faol emas");
    }

    if (session.computerId === newComputerId) {
      throw new Error("Yangi kompyuter eski kompyuter bilan bir xil");
    }

    const newComputer = await prisma.computer.findUnique({
      where: { id: newComputerId },
    });

    if (!newComputer) {
      throw new Error("Yangi kompyuter topilmadi");
    }

    if (newComputer.status !== "FREE") {
      throw new Error("Yangi kompyuter band");
    }

    const updatedSession = await prisma.$transaction(async (tx) => {
      // 1. Make old computer FREE
      await tx.computer.update({
        where: { id: session.computerId },
        data: { status: "FREE" },
      });

      // 2. Make new computer OCCUPIED/ENDING_SOON depending on time left
      const now = new Date();
      const timeLeftMs = new Date(session.endsAt).getTime() - now.getTime();
      const newStatus = timeLeftMs < 10 * 60 * 1000 ? "ENDING_SOON" : "OCCUPIED";

      await tx.computer.update({
        where: { id: newComputerId },
        data: { status: newStatus },
      });

      // 3. Update Session computerId
      const sess = await tx.session.update({
        where: { id: sessionId },
        data: {
          computerId: newComputerId,
        },
      });

      // 4. Log Activity
      await tx.activityLog.create({
        data: {
          actorId: actorId || null,
          action: "computer_changed",
          targetType: "computer",
          targetId: newComputerId,
        },
      });

      return sess;
    });

    try {
      const io = getIo();
      
      const now = new Date();
      const timeLeftMs = new Date(updatedSession.endsAt).getTime() - now.getTime();
      const newStatus = timeLeftMs < 10 * 60 * 1000 ? "ENDING_SOON" : "OCCUPIED";

      // Emit lock and status FREE for old computer
      io.to("admin-room").emit("computer:status_changed", {
        computerId: session.computerId,
        status: "FREE",
        session: null,
      });
      io.to(`pc-${session.computerId}`).emit("pc:lock");

      // Emit unlock and status for new computer
      io.to("admin-room").emit("computer:status_changed", {
        computerId: newComputerId,
        status: newStatus,
        session: {
          id: updatedSession.id,
          startedAt: updatedSession.startedAt,
          endsAt: updatedSession.endsAt,
          customerName: updatedSession.customerName,
        },
      });
      io.to(`pc-${newComputerId}`).emit("pc:unlock", {
        sessionId: updatedSession.id,
        endsAt: updatedSession.endsAt,
      });
    } catch (err: any) {
      console.warn("Real-time emit failed or Socket.io not initialized:", err.message);
    }

    return updatedSession;
  }

  static async checkEndingSoon() {
    const now = new Date();

    const activeSessions = await prisma.session.findMany({
      where: { status: "ACTIVE" },
      include: { computer: true },
    });

    const results = {
      ended: [] as string[],
      flagged: [] as string[],
    };

    for (const session of activeSessions) {
      const timeLeftMs = session.endsAt.getTime() - now.getTime();

      if (timeLeftMs <= 0) {
        await this.stopSession(session.id);
        results.ended.push(session.id);
      } else if (timeLeftMs < 10 * 60 * 1000) {
        if (session.computer.status !== "ENDING_SOON") {
          await prisma.computer.update({
            where: { id: session.computerId },
            data: { status: "ENDING_SOON" },
          });
          results.flagged.push(session.id);
          try {
            const io = getIo();
            io.to("admin-room").emit("computer:status_changed", {
              computerId: session.computerId,
              status: "ENDING_SOON",
              session: {
                id: session.id,
                startedAt: session.startedAt,
                endsAt: session.endsAt,
                customerName: session.customerName,
              },
            });
          } catch (err: any) {
            console.warn("Real-time emit failed or Socket.io not initialized:", err.message);
          }
        }
      } else {
        if (session.computer.status === "ENDING_SOON") {
          await prisma.computer.update({
            where: { id: session.computerId },
            data: { status: "OCCUPIED" },
          });
          try {
            const io = getIo();
            io.to("admin-room").emit("computer:status_changed", {
              computerId: session.computerId,
              status: "OCCUPIED",
              session: {
                id: session.id,
                startedAt: session.startedAt,
                endsAt: session.endsAt,
                customerName: session.customerName,
              },
            });
          } catch (err: any) {
            console.warn("Real-time emit failed or Socket.io not initialized:", err.message);
          }
        }
      }
    }

    return results;
  }
}
