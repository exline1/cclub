export function normalizePhone(rawPhone: string): string {
  // Telegram contact raqamlari "+" bilan yoki bo'lmasligi mumkin
  let phone = rawPhone.replace(/[^\d]/g, "");
  if (!phone.startsWith("998")) {
    phone = "998" + phone.slice(-9);
  }
  return "+" + phone;
}
