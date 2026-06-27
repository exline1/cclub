import { Context } from "telegraf";
import { prisma } from "../lib/prisma";

export async function getCodeHandler(ctx: Context) {
  const chatId = ctx.chat?.id.toString();
  if (!chatId) return;

  const isRussian = (ctx.message as any).text === "Получить код";

  // Find the telegram link
  const link = await prisma.telegramLink.findFirst({
    where: { chatId },
  });

  if (!link) {
    const text = isRussian 
      ? "Сначала отправьте свой контакт с помощью команды /start" 
      : "Iltimos, avval /start buyrug'i orqali kontaktingizni ulashing.";
    return ctx.reply(text);
  }

  // Generate a new 6 digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set expiration to 5 mins from now
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);

  // Save to database
  await prisma.phoneVerification.create({
    data: {
      phone: link.phone,
      code,
      telegramChatId: chatId,
      expiresAt,
    }
  });

  const messageText = isRussian
    ? `Ваш код подтверждения cClub: <b>${code}</b>\n\nВернитесь на сайт и введите этот код.`
    : `Sizning cClub tasdiqlash kodingiz: <b>${code}</b>\n\nSaytga qaytib ushbu kodni kiriting.`;

  await ctx.reply(messageText, { 
    parse_mode: "HTML",
    reply_markup: { remove_keyboard: true }
  });
}
