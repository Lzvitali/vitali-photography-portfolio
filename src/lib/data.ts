import fs from "fs";
import path from "path";
import type { PortfolioData, SiteData } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

export function getPortfolioData(): PortfolioData {
  const filePath = path.join(DATA_DIR, "portfolio.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as PortfolioData;
}

export function getSiteData(): SiteData {
  const filePath = path.join(DATA_DIR, "site.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as SiteData;
}

export function writePortfolioData(data: PortfolioData): void {
  const filePath = path.join(DATA_DIR, "portfolio.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function writeSiteData(data: SiteData): void {
  const filePath = path.join(DATA_DIR, "site.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
