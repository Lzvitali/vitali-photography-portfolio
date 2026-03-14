import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const { getPortfolioData, getSiteData } = await import("@/lib/data");
  const portfolio = getPortfolioData();
  const site = getSiteData();

  return NextResponse.json({ portfolio, site });
}
