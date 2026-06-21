import { PrismaClient, Zone } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding computers...");

  // Delete existing records to allow a clean re-run of the seed script
  await prisma.activityLog.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.computer.deleteMany({});

  const computersData = [];

  // Standard computers (1 - 10)
  for (let i = 1; i <= 10; i++) {
    computersData.push({
      number: i,
      zone: Zone.STANDARD,
      hourlyRate: 10000, // 10,000 UZS
      status: "FREE" as const,
    });
  }

  // VIP computers (11 - 15)
  for (let i = 11; i <= 15; i++) {
    computersData.push({
      number: i,
      zone: Zone.VIP,
      hourlyRate: 15000, // 15,000 UZS
      status: "FREE" as const,
    });
  }

  // PS5 computers (16 - 20)
  for (let i = 16; i <= 20; i++) {
    computersData.push({
      number: i,
      zone: Zone.PS5,
      hourlyRate: 20000, // 20,000 UZS
      status: "FREE" as const,
    });
  }

  for (const pc of computersData) {
    await prisma.computer.upsert({
      where: { number: pc.number },
      update: {},
      create: pc,
    });
  }

  console.log("Seeding complete! 20 computers created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
