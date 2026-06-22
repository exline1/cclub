import prisma from "../../lib/prisma";

const defaultSettings = [
  {
    key: "zone_prices",
    value: { standard: 10000, vip: 15000, ps5: 20000 },
  },
  {
    key: "club_hours",
    value: { open: "08:00", close: "23:00" },
  },
  {
    key: "club_info",
    value: { name: "CClub", address: "Tashkent, Uzbekistan", phone: "+998901234567" },
  },
];

export class SettingService {
  static async ensureDefaultSettings() {
    for (const setting of defaultSettings) {
      const existing = await prisma.setting.findUnique({
        where: { key: setting.key },
      });
      if (!existing) {
        await prisma.setting.create({
          data: {
            key: setting.key,
            value: setting.value,
          },
        });
      }
    }
  }

  static async getSetting(key: string) {
    await this.ensureDefaultSettings();
    return prisma.setting.findUnique({
      where: { key },
    });
  }

  static async getAllSettings() {
    await this.ensureDefaultSettings();
    return prisma.setting.findMany();
  }

  static async upsertSetting(key: string, value: any) {
    const result = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    if (key === "zone_prices") {
      const prices = value as Record<string, any>;
      
      const standardPrice = prices.standard ?? prices.STANDARD;
      if (standardPrice !== undefined) {
        await prisma.computer.updateMany({
          where: { zone: "STANDARD" },
          data: { hourlyRate: Math.round(Number(standardPrice)) },
        });
      }

      const vipPrice = prices.vip ?? prices.VIP;
      if (vipPrice !== undefined) {
        await prisma.computer.updateMany({
          where: { zone: "VIP" },
          data: { hourlyRate: Math.round(Number(vipPrice)) },
        });
      }

      const ps5Price = prices.ps5 ?? prices.PS5;
      if (ps5Price !== undefined) {
        await prisma.computer.updateMany({
          where: { zone: "PS5" },
          data: { hourlyRate: Math.round(Number(ps5Price)) },
        });
      }
    }

    return result;
  }
}
