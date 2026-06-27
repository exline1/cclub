import { Context } from "telegraf";

export async function languageHandler(ctx: Context) {
  const cbQuery = ctx.callbackQuery as any;
  if (!cbQuery) return;
  
  const lang = cbQuery.data; // "lang_uz" yoki "lang_ru"
  
  // Ma'lumotlarni contextda yoki sessiyada saqlash mumkin, 
  // lekin hozircha oddiygina tilga mos javob qaytaramiz:
  const text = lang === "lang_uz" 
    ? "cClub botiga xush kelibsiz! 👋\n\nTelefon raqamingizni tasdiqlash uchun, quyidagi tugma orqali kontaktingizni ulashing:"
    : "Добро пожаловать в бот cClub! 👋\n\nЧтобы подтвердить свой номер телефона, поделитесь контактом с помощью кнопки ниже:";

  const btnText = lang === "lang_uz" ? "📱 Telefon raqamni ulashish" : "📱 Поделиться контактом";

  await ctx.deleteMessage();
  await ctx.reply(text, {
    reply_markup: {
      keyboard: [
        [{ text: btnText, request_contact: true }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
}
