/**
 * Seed script: uploads cover images from /images/ to Cloudinary
 * and updates data/portfolio.json with the results.
 * 
 * Usage: node scripts/seed.mjs
 * Requires: .env.local with Cloudinary credentials
 */

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

// Bypass corporate proxy SSL interception
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// Load .env.local manually
const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx);
      const val = trimmed.slice(eqIdx + 1);
      process.env[key] = val;
    }
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const COVER_MAP = [
  { category: "cat-events", file: "DSC02078.jpg" },
  { category: "cat-views", file: "DSC00923.jpg" },
  { category: "cat-animals", file: "DSC00703.jpg" },
  { category: "cat-couples", file: "DSC08332.jpg" },
  { category: "cat-street", file: "cover-street photography3_c.jpg" },
];

const PORTRAIT_FILE = "v2-8851 2.jpg";

async function uploadFile(filePath, folder) {
  console.log(`  Uploading ${path.basename(filePath)}...`);
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
  });
  console.log(`  -> ${result.public_id} (${result.width}x${result.height})`);
  return result;
}

async function main() {
  console.log("Seeding portfolio with cover images...\n");

  const portfolioPath = path.join(ROOT, "data", "portfolio.json");
  const sitePath = path.join(ROOT, "data", "site.json");
  const portfolio = JSON.parse(fs.readFileSync(portfolioPath, "utf-8"));
  const site = JSON.parse(fs.readFileSync(sitePath, "utf-8"));

  // Upload cover images
  for (const { category, file } of COVER_MAP) {
    const filePath = path.join(ROOT, "images", file);
    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP: ${file} not found`);
      continue;
    }

    const result = await uploadFile(filePath, "portfolio");
    const imageId = `img-${randomUUID().slice(0, 8)}`;

    const newImage = {
      id: imageId,
      url: result.secure_url,
      public_id: result.public_id,
      title: "",
      categoryId: category,
      width: result.width,
      height: result.height,
      order: 0,
      focalPoint: { x: 50, y: 50 },
    };

    portfolio.images.push(newImage);

    const catIdx = portfolio.categories.findIndex((c) => c.id === category);
    if (catIdx !== -1) {
      portfolio.categories[catIdx].coverImageId = imageId;
      console.log(`  Set as cover for "${portfolio.categories[catIdx].name}"\n`);
    }
  }

  // Upload portrait
  const portraitPath = path.join(ROOT, "images", PORTRAIT_FILE);
  if (fs.existsSync(portraitPath)) {
    console.log("Uploading portrait photo...");
    const result = await uploadFile(portraitPath, "portfolio");
    site.portraitUrl = result.secure_url;
    console.log(`  Set as portrait in site.json\n`);
  }

  // Save
  fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2), "utf-8");
  fs.writeFileSync(sitePath, JSON.stringify(site, null, 2), "utf-8");

  console.log("Done! portfolio.json and site.json updated.");
  console.log(`  ${portfolio.images.length} images total`);
  console.log(`  ${portfolio.categories.length} categories`);
  console.log(`\nStart the dev server to see the result: ./start.sh`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
