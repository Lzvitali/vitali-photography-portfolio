import { NextRequest, NextResponse } from "next/server";
import type { PortfolioData, SiteData } from "@/lib/types";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ error: "Not allowed" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    const { writePortfolioData, writeSiteData } = await import("@/lib/data");
    const body = await request.json();
    const { portfolio, site } = body as {
      portfolio?: PortfolioData;
      site?: SiteData;
    };

    if (portfolio) {
      writePortfolioData(portfolio);
    }

    if (site) {
      writeSiteData(site);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { error: "Save failed" },
      { status: 500 }
    );
  }
}
