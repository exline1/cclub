import prisma from "../../lib/prisma";

export class ShiftService {
  static async openShift(userId: string) {
    const activeShift = await prisma.shift.findFirst({
      where: { closedAt: null },
    });

    if (activeShift) {
      throw new Error("Allaqachon ochiq shift mavjud");
    }

    return prisma.shift.create({
      data: {
        openedById: userId,
        openedAt: new Date(),
      },
    });
  }

  static async closeShift(shiftId: string) {
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
    });

    if (!shift) {
      throw new Error("Shift topilmadi");
    }

    if (shift.closedAt) {
      throw new Error("Shift allaqachon yopilgan");
    }

    const now = new Date();

    // Sum totalAmount of COMPLETED sessions ended during the shift
    const sessions = await prisma.session.findMany({
      where: {
        status: "COMPLETED",
        endsAt: {
          gte: shift.openedAt,
          lte: now,
        },
      },
      select: {
        totalAmount: true,
      },
    });

    const totalPcRevenue = sessions.reduce((sum: number, s: { totalAmount: number | null }) => sum + (s.totalAmount ?? 0), 0);

    // Sum total of all non-cancelled orders created during the shift
    const orders = await prisma.order.findMany({
      where: {
        status: { not: "CANCELLED" },
        createdAt: {
          gte: shift.openedAt,
          lte: now,
        },
      },
      select: {
        total: true,
      },
    });

    const totalBarRevenue = orders.reduce((sum: number, o: { total: number }) => sum + o.total, 0);

    return prisma.shift.update({
      where: { id: shiftId },
      data: {
        closedAt: now,
        totalPcRevenue,
        totalBarRevenue,
      },
    });
  }

  static async getCurrentShift() {
    return prisma.shift.findFirst({
      where: { closedAt: null },
      include: {
        openedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  static async getShiftHistory() {
    return prisma.shift.findMany({
      where: {
        closedAt: { not: null },
      },
      orderBy: {
        closedAt: "desc",
      },
      include: {
        openedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }
}
