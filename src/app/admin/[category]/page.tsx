"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { PortfolioData, PortfolioImage, FocalPoint } from "@/lib/types";
import ImageUploader from "@/components/admin/ImageUploader";
import SortableGallery from "@/components/admin/SortableGallery";
import FocalPointPicker from "@/components/admin/FocalPointPicker";

interface AdminCategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function AdminCategoryPage({ params }: AdminCategoryPageProps) {
  const { category: slug } = use(params);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [focalPointImage, setFocalPointImage] =
    useState<PortfolioImage | null>(null);

  useEffect(() => {
    fetch("/api/data")
      .then((r) => r.json())
      .then((data) => setPortfolio(data.portfolio));
  }, []);

  const category = portfolio?.categories.find((c) => c.slug === slug);
  const images = portfolio?.images
    .filter((img) => img.categoryId === category?.id)
    .sort((a, b) => a.order - b.order) ?? [];

  const savePortfolio = useCallback(
    async (data: PortfolioData) => {
      setSaving(true);
      try {
        await fetch("/api/save-config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ portfolio: data }),
        });
        setMessage("Saved!");
        setTimeout(() => setMessage(""), 3000);
      } catch {
        setMessage("Save failed");
      }
      setSaving(false);
    },
    []
  );

  function handleUpload(result: {
    url: string;
    public_id: string;
    width: number;
    height: number;
  }) {
    if (!portfolio || !category) return;
    const newImage: PortfolioImage = {
      id: `img-${uuidv4().slice(0, 8)}`,
      url: result.url,
      public_id: result.public_id,
      title: "",
      categoryId: category.id,
      width: result.width,
      height: result.height,
      order: images.length,
      focalPoint: { x: 50, y: 50 },
    };

    const updated = {
      ...portfolio,
      images: [...portfolio.images, newImage],
    };
    setPortfolio(updated);
  }

  function handleReorder(reordered: PortfolioImage[]) {
    if (!portfolio || !category) return;
    const otherImages = portfolio.images.filter(
      (img) => img.categoryId !== category.id
    );
    setPortfolio({
      ...portfolio,
      images: [...otherImages, ...reordered],
    });
  }

  function handleDelete(imageId: string) {
    if (!portfolio || !category) return;
    if (!confirm("Delete this image?")) return;

    const updated = {
      ...portfolio,
      images: portfolio.images.filter((img) => img.id !== imageId),
      categories: portfolio.categories.map((c) =>
        c.coverImageId === imageId ? { ...c, coverImageId: null } : c
      ),
    };
    setPortfolio(updated);
  }

  function handleSetCover(imageId: string) {
    if (!portfolio || !category) return;
    setPortfolio({
      ...portfolio,
      categories: portfolio.categories.map((c) =>
        c.id === category.id ? { ...c, coverImageId: imageId } : c
      ),
    });
  }

  function handleFocalPointSave(point: FocalPoint) {
    if (!portfolio || !focalPointImage) return;
    setPortfolio({
      ...portfolio,
      images: portfolio.images.map((img) =>
        img.id === focalPointImage.id ? { ...img, focalPoint: point } : img
      ),
    });
    setFocalPointImage(null);
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-2">Category not found</p>
          <Link href="/admin" className="text-blue-500 text-sm">
            Back to admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{category.name}</h1>
            <p className="text-xs text-neutral-400">
              {images.length} photos &middot; /{category.slug}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className="text-sm text-green-600 dark:text-green-400">
              {message}
            </span>
          )}
          <button
            onClick={() => savePortfolio(portfolio)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <ImageUploader onUpload={handleUpload} />
      </div>

      {images.length > 0 ? (
        <SortableGallery
          images={images}
          coverImageId={category.coverImageId}
          onReorder={handleReorder}
          onDelete={handleDelete}
          onSetFocalPoint={setFocalPointImage}
          onSetCover={handleSetCover}
        />
      ) : (
        <div className="text-center py-16 text-neutral-400">
          <p>No images yet. Upload some above!</p>
        </div>
      )}

      {focalPointImage && (
        <FocalPointPicker
          imageUrl={focalPointImage.url}
          initialPoint={focalPointImage.focalPoint || { x: 50, y: 50 }}
          onSave={handleFocalPointSave}
          onClose={() => setFocalPointImage(null)}
        />
      )}
    </div>
  );
}
