import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logoPath = path.join(__dirname, "..", "public", "logo.png");
const appDir = path.join(__dirname, "..", "src", "app");
const faviconPath = path.join(appDir, "favicon.ico");

async function generate() {
  try {
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
    }
    
    await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toFile(faviconPath);
    console.log("Favicon created at src/app/favicon.ico");
  } catch (error) {
    console.error("Error creating favicon:", error);
  }
}

generate();
