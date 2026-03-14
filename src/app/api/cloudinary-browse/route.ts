import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ error: "Not allowed" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const cloudinary = (await import("@/lib/cloudinary")).default;
    const { urls } = (await request.json()) as { urls: string[] };

    if (!urls?.length) {
      return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
    }

    const results: {
      url: string;
      secure_url: string;
      public_id: string;
      width: number;
      height: number;
      error?: string;
    }[] = [];

    for (const url of urls) {
      try {
        const match = url.match(
          /res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:.*?\/)?v?\d*\/?(.+?)(?:\.\w+)?$/
        );
        if (match) {
          const publicId = match[1];
          const resource = await cloudinary.api.resource(publicId, {
            resource_type: "image",
          });
          results.push({
            url,
            secure_url: resource.secure_url,
            public_id: resource.public_id,
            width: resource.width,
            height: resource.height,
          });
        } else {
          results.push({
            url,
            secure_url: url,
            public_id: "",
            width: 0,
            height: 0,
            error: "Not a Cloudinary URL — uploading to Cloudinary...",
          });
          const uploaded = await cloudinary.uploader.upload(url, {
            folder: "portfolio",
            resource_type: "image",
          });
          results[results.length - 1] = {
            url,
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id,
            width: uploaded.width,
            height: uploaded.height,
          };
        }
      } catch (err) {
        results.push({
          url,
          secure_url: "",
          public_id: "",
          width: 0,
          height: 0,
          error: err instanceof Error ? err.message : "Failed to resolve",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("URL import error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
