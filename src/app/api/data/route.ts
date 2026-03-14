import { NextResponse } from "next/server";
import { getPortfolioData, getSiteData } from "@/lib/data";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const portfolio = getPortfolioData();
  const site = getSiteData();

  return NextResponse.json({ portfolio, site });
}
