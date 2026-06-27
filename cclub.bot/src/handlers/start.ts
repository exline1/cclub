import { Context } from "telegraf";

export async function startHandler(ctx: Context) {
  await ctx.reply(
    "Tilni tanlang / Выберите язык:",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🇺🇿 O'zbekcha", callback_data: "lang_uz" },
            { text: "🇷🇺 Русский", callback_data: "lang_ru" }
          ]
        ]
      }
    }
  );
}
