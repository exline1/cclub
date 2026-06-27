import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import readline from "readline";

const prisma = new PrismaClient();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function createAdmin() {
  console.log("=== cClub Admin Yaratish ===");
  const email = await new Promise<string>((res) =>
    rl.question("Admin email: ", res)
  );
  const password = await new Promise<string>((res) =>
    rl.question("Admin parol (kuchli parol kiriting): ", res)
  );

  if (!email || !password) {
    console.log("Email va parol kiritilishi shart!");
    rl.close();
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 12);

  try {
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash: hashed, role: "SUPER_ADMIN" },
      create: { 
        name: "Super Admin",
        email, 
        passwordHash: hashed, 
        role: "SUPER_ADMIN" 
      },
    });

    console.log(`\nMuvaffaqiyatli! Admin yaratildi: ${email}`);
    console.log("Parol xavfsiz tarzda hash qilinib saqlandi (koda yozilmadi).");
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

createAdmin();
