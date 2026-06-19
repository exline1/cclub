/**
 * Placeholder rasm fayllarini yaratadi (haqiqiy JPEG).
 * Ishlatish: npm run generate-images
 *
 * Haqiqiy rasmlarni qo'yish uchun faqat public/images/ dagi
 * tegishli .jpg fayllarni almashtiring — kod o'zgarmaydi.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "..", "public", "images");

const placeholders = [
  {
    name: "hero-bg.jpg",
    width: 1920,
    height: 1080,
    colors: ["#0a0e1a", "#312e81", "#4f46e5"],
    label: "HERO",
  },
  {
    name: "zone-standard.jpg",
    width: 800,
    height: 500,
    colors: ["#0f1729", "#1e3a5f", "#4f46e5"],
    label: "STANDARD",
  },
  {
    name: "zone-vip.jpg",
    width: 800,
    height: 500,
    colors: ["#0a0e1a", "#312e81", "#6366f1"],
    label: "VIP",
  },
  {
    name: "zone-ps5.jpg",
    width: 800,
    height: 500,
    colors: ["#0f1729", "#1a1a2e", "#4f46e5"],
    label: "PS5",
  },
];

function createSvg({ width, height, colors, label }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors[0]}"/>
      <stop offset="50%" style="stop-color:${colors[1]}"/>
      <stop offset="100%" style="stop-color:${colors[2]}"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(99,102,241,0.08)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <text x="50%" y="48%" text-anchor="middle" fill="rgba(241,245,249,0.15)" font-family="Arial,sans-serif" font-size="${Math.round(width * 0.06)}" font-weight="bold">${label}</text>
  <text x="50%" y="56%" text-anchor="middle" fill="rgba(148,163,184,0.4)" font-family="Arial,sans-serif" font-size="${Math.round(width * 0.02)}">Placeholder</text>
</svg>`;
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

for (const item of placeholders) {
  const jpgPath = path.join(imagesDir, item.name);
  const svgBuffer = Buffer.from(createSvg(item));

  await sharp(svgBuffer)
    .jpeg({ quality: 75, mozjpeg: true })
    .toFile(jpgPath);

  console.log(`Yaratildi: ${item.name}`);
}

console.log("Barcha placeholder rasmlar tayyor: public/images/");
