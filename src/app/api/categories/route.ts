import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData, writePortfolioData } from "@/lib/data";
import type { Category } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    const { name, slug } = await request.json();
    const data = getPortfolioData();

    const newCategory: Category = {
      id: `cat-${uuidv4().slice(0, 8)}`,
      name,
      slug,
      order: data.categories.length,
      coverImageId: null,
      coverCrop: { x: 0, y: 0, width: 100, height: 100 },
      cardLayout: "landscape",
    };

    data.categories.push(newCategory);
    writePortfolioData(data);

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    const category = (await request.json()) as Category;
    const data = getPortfolioData();

    const index = data.categories.findIndex((c) => c.id === category.id);
    if (index === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    data.categories[index] = category;
    writePortfolioData(data);

    return NextResponse.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    const { id } = await request.json();
    const data = getPortfolioData();

    data.categories = data.categories.filter((c) => c.id !== id);
    data.images = data.images.filter((img) => img.categoryId !== id);
    writePortfolioData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
