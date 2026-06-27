import { Context } from "telegraf";
import { prisma } from "../lib/prisma";
import { normalizePhone } from "../utils/normalizePhone";

export async function contactHandler(ctx: Context) {
  const message = ctx.message as any;
  const contact = message?.contact;

  if (!contact) {
    return ctx.reply("Kontakt topilmadi. Iltimos, tugma orqali ulashing.");
  }

  const phone = normalizePhone(contact.phone_number);
  const chatId = ctx.chat?.id.toString();

  if (!chatId) return;

  // Telefon raqami va chat_id'ni database'da yangilash/yaratish
  await prisma.telegramLink.upsert({
    where: { phone },
    update: { chatId },
    create: { phone, chatId },
  });

  const btnText = message.text?.includes("Поделиться") || (ctx.from?.language_code === "ru") ? "Получить код" : "Kodni olish";
  const msgText = btnText === "Получить код" 
    ? "✅ Ваш номер успешно привязан.\n\nНажмите кнопку ниже, чтобы получить код подтверждения."
    : "✅ Raqamingiz muvaffaqiyatli ulandi.\n\nTasdiqlash kodini olish uchun quyidagi tugmani bosing.";

  await ctx.reply(msgText, {
    reply_markup: {
      keyboard: [[{ text: btnText }]],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
}
