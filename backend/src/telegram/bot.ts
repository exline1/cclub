import { Telegraf } from 'telegraf';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const botToken = process.env.TELEGRAM_BOT_TOKEN;

export let bot: Telegraf | null = null;

export const phoneToChatIdCache: Record<string, string> = {};

export function initTelegramBot() {
  if (!botToken) {
    console.warn("⚠️ TELEGRAM_BOT_TOKEN topilmadi. Telegram bot ishga tushmaydi.");
    return;
  }

  bot = new Telegraf(botToken);

  bot.start(async (ctx) => {
    const chatId = ctx.chat.id;
    await ctx.reply("Assalomu alaykum! cClub tizimiga xush kelibsiz.\nIltimos, telefon raqamingizni biz bilan ulashing:", {
      reply_markup: {
        keyboard: [[{ text: "📱 Telefon raqamni ulashish", request_contact: true }]],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    });
  });

  bot.on("contact", async (ctx) => {
    const chatId = ctx.chat.id.toString();
    const contact = ctx.message.contact;
    
    if (contact) {
      let phone = contact.phone_number;
      if (!phone.startsWith("+")) phone = "+" + phone;
      phone = phone.replace(/[\s()-]/g, "");

      // Vaqtinchalik keshga saqlash (Redis yo'qligi sababli)
      phoneToChatIdCache[phone] = chatId;
      
      // Agar bazada user bo'lsa, uni ham yangilab qoyamiz
      await prisma.user.updateMany({
        where: { phone },
        data: { telegramChatId: chatId }
      });
      
      await ctx.reply("Raqamingiz muvaffaqiyatli qabul qilindi. ✅\n\nEndi saytga qaytib, kodingizni so'rashingiz mumkin.", {
        reply_markup: { remove_keyboard: true }
      });
    }
  });

  bot.launch().then(() => {
    console.log("🤖 Telegram bot polling orqali ishga tushdi.");
  });

  // Enable graceful stop
  process.once('SIGINT', () => bot?.stop('SIGINT'));
  process.once('SIGTERM', () => bot?.stop('SIGTERM'));
}
