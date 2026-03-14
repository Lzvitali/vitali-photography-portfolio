"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Link2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { PortfolioData, PortfolioImage, FocalPoint } from "@/lib/types";
import ImageUploader from "@/components/admin/ImageUploader";
import SortableGallery from "@/components/admin/SortableGallery";
import FocalPointPicker from "@/components/admin/FocalPointPicker";
import CloudinaryPicker from "@/components/admin/CloudinaryPicker";

interface AdminCategoryClientProps {
  slug: string;
}

export default function AdminCategoryClient({ slug }: AdminCategoryClientProps) {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [focalPointImage, setFocalPointImage] =
    useState<PortfolioImage | null>(null);
  const [showCloudinaryPicker, setShowCloudinaryPicker] = useState(false);

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
    setPortfolio((prev) => {
      if (!prev) return prev;
      const cat = prev.categories.find((c) => c.slug === slug);
      if (!cat) return prev;
      const currentCount = prev.images.filter((img) => img.categoryId === cat.id).length;
      const newImage: PortfolioImage = {
        id: `img-${uuidv4().slice(0, 8)}`,
        url: result.url,
        public_id: result.public_id,
        title: "",
        categoryId: cat.id,
        width: result.width,
        height: result.height,
        order: currentCount,
        focalPoint: { x: 50, y: 50 },
      };
      return { ...prev, images: [...prev.images, newImage] };
    });
  }

  function handleCloudinaryImport(
    images: { secure_url: string; public_id: string; width: number; height: number }[]
  ) {
    setPortfolio((prev) => {
      if (!prev) return prev;
      const cat = prev.categories.find((c) => c.slug === slug);
      if (!cat) return prev;
      let currentCount = prev.images.filter((img) => img.categoryId === cat.id).length;
      const newImages: PortfolioImage[] = images.map((img) => ({
        id: `img-${uuidv4().slice(0, 8)}`,
        url: img.secure_url,
        public_id: img.public_id,
        title: "",
        categoryId: cat.id,
        width: img.width,
        height: img.height,
        order: currentCount++,
        focalPoint: { x: 50, y: 50 },
      }));
      return { ...prev, images: [...prev.images, ...newImages] };
    });
  }

  const handleReorder = useCallback(
    (reordered: PortfolioImage[]) => {
      setPortfolio((prev) => {
        if (!prev) return prev;
        const cat = prev.categories.find((c) => c.slug === slug);
        if (!cat) return prev;
        const otherImages = prev.images.filter(
          (img) => img.categoryId !== cat.id
        );
        return { ...prev, images: [...otherImages, ...reordered] };
      });
    },
    [slug]
  );

  const handleDelete = useCallback(
    (imageId: string) => {
      if (!confirm("Delete this image?")) return;
      setPortfolio((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          images: prev.images.filter((img) => img.id !== imageId),
          categories: prev.categories.map((c) =>
            c.coverImageId === imageId ? { ...c, coverImageId: null } : c
          ),
        };
      });
    },
    []
  );

  const handleSetCover = useCallback(
    (imageId: string) => {
      setPortfolio((prev) => {
        if (!prev) return prev;
        const cat = prev.categories.find((c) => c.slug === slug);
        if (!cat) return prev;
        return {
          ...prev,
          categories: prev.categories.map((c) =>
            c.id === cat.id ? { ...c, coverImageId: imageId } : c
          ),
        };
      });
    },
    [slug]
  );

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

      <div className="mb-6 space-y-3">
        <ImageUploader onUpload={handleUpload} />
        <button
          onClick={() => setShowCloudinaryPicker(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-blue-300 dark:border-blue-700 rounded-lg text-sm text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
        >
          <Link2 size={16} />
          Import from URL
        </button>
      </div>

      {showCloudinaryPicker && (
        <CloudinaryPicker
          onImport={handleCloudinaryImport}
          onClose={() => setShowCloudinaryPicker(false)}
        />
      )}

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
