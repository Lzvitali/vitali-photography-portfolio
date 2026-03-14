/**
 * Sync script: fetches all images from the Cloudinary "portfolio" folder
 * and adds any that are missing from data/portfolio.json.
 *
 * Usage: node scripts/sync-cloudinary.mjs <categoryId>
 * Example: node scripts/sync-cloudinary.mjs cat-couples
 *
 * If no categoryId is provided, lists all images and existing categories.
 */

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const envPath = path.join(ROOT, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx);
      const value = trimmed.slice(eqIdx + 1);
      process.env[key] = value;
    }
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const portfolioPath = path.join(ROOT, "data", "portfolio.json");
const data = JSON.parse(fs.readFileSync(portfolioPath, "utf-8"));

const existingPublicIds = new Set(data.images.map((img) => img.public_id));

const categoryId = process.argv[2];

if (!categoryId) {
  console.log("\nExisting categories:");
  data.categories.forEach((c) => console.log(`  ${c.id} -> ${c.name}`));
  console.log("\nUsage: node scripts/sync-cloudinary.mjs <categoryId>");
  console.log("Example: node scripts/sync-cloudinary.mjs cat-couples\n");
  console.log("Fetching all images from Cloudinary portfolio folder...\n");
}

const category = data.categories.find((c) => c.id === categoryId);
if (categoryId && !category) {
  console.error(`Category "${categoryId}" not found. Available categories:`);
  data.categories.forEach((c) => console.log(`  ${c.id} -> ${c.name}`));
  process.exit(1);
}

async function fetchAllCloudinaryImages() {
  const all = [];
  let nextCursor = undefined;

  do {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "portfolio/",
      max_results: 500,
      next_cursor: nextCursor,
    });
    all.push(...result.resources);
    nextCursor = result.next_cursor;
  } while (nextCursor);

  return all;
}

const resources = await fetchAllCloudinaryImages();
console.log(`Found ${resources.length} images in Cloudinary "portfolio" folder`);

const missing = resources.filter((r) => !existingPublicIds.has(r.public_id));
console.log(`${missing.length} images not yet in portfolio.json`);

if (missing.length === 0) {
  console.log("Nothing to add.");
  process.exit(0);
}

if (!categoryId) {
  console.log("\nMissing images (public_id):");
  missing.forEach((r) => console.log(`  ${r.public_id} (${r.width}x${r.height})`));
  console.log("\nRe-run with a categoryId to add them:");
  console.log("  node scripts/sync-cloudinary.mjs cat-couples\n");
  process.exit(0);
}

const currentCount = data.images.filter((img) => img.categoryId === categoryId).length;

for (let i = 0; i < missing.length; i++) {
  const r = missing[i];
  data.images.push({
    id: `img-${randomUUID().slice(0, 8)}`,
    url: r.secure_url,
    public_id: r.public_id,
    title: "",
    categoryId,
    width: r.width,
    height: r.height,
    order: currentCount + i,
    focalPoint: { x: 50, y: 50 },
  });
  console.log(`  Added: ${r.public_id} (${r.width}x${r.height})`);
}

fs.writeFileSync(portfolioPath, JSON.stringify(data, null, 2), "utf-8");
console.log(`\nDone! Added ${missing.length} images to "${category.name}" category.`);
