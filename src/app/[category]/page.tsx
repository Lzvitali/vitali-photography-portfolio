import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPortfolioData } from "@/lib/data";
import MasonryGrid from "@/components/public/MasonryGrid";

export async function generateStaticParams() {
  const portfolio = getPortfolioData();
  return portfolio.categories.map((cat) => ({
    category: cat.slug,
  }));
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const portfolio = getPortfolioData();

  const category = portfolio.categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const images = portfolio.images
    .filter((img) => img.categoryId === category.id)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <div className="px-5 md:px-8 pt-6 md:pt-8 pb-8 md:pb-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs tracking-[0.12em] uppercase text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Collections
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-wide">
          {category.name}
        </h1>
      </div>

      {images.length > 0 ? (
        <MasonryGrid images={images} />
      ) : (
        <div className="text-center py-20 text-neutral-400 dark:text-neutral-600">
          <p className="text-lg">No photos yet</p>
          <p className="text-sm mt-2">
            Upload images via the admin panel in development mode.
          </p>
        </div>
      )}
    </>
  );
}
