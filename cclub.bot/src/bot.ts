import { Telegraf } from "telegraf";
import { startHandler } from "./handlers/start";
import { contactHandler } from "./handlers/contact";
import { languageHandler } from "./handlers/language";
import "dotenv/config";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN environment variable topilmadi (.env faylni tekshiring)");
}

const bot = new Telegraf(token);

bot.start(startHandler);
bot.action("lang_uz", languageHandler);
bot.action("lang_ru", languageHandler);

bot.on("contact", contactHandler);

import { getCodeHandler } from "./handlers/getCode";
bot.hears(["Kodni olish", "Получить код"], getCodeHandler);

bot.launch();
console.log("cClub Telegram bot ishga tushdi ✅");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
