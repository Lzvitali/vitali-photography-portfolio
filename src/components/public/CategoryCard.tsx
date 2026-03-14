"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Category, PortfolioImage } from "@/lib/types";
import { thumbnailUrl } from "@/lib/image-url";

interface CategoryCardProps {
  category: Category;
  coverImage: PortfolioImage | null;
  imageCount: number;
  className?: string;
}

export default function CategoryCard({
  category,
  coverImage,
  imageCount,
  className = "",
}: CategoryCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const coverSrc = category.coverUrl
    ? thumbnailUrl(category.coverUrl)
    : coverImage
      ? thumbnailUrl(coverImage.url)
      : "";
  const focalX = coverImage?.focalPoint?.x ?? 50;
  const focalY = coverImage?.focalPoint?.y ?? 50;

  return (
    <Link
      ref={ref}
      href={`/${category.slug}`}
      className={`group relative overflow-hidden rounded-sm block ${className} ${
        visible ? "animate-fadeUp" : "opacity-0"
      }`}
    >
      {coverSrc ? (
        <img
          src={coverSrc}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ objectPosition: `${focalX}% ${focalY}%` }}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
          <span className="text-neutral-400 dark:text-neutral-600 text-sm tracking-widest uppercase">
            No Cover
          </span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent group-hover:from-black/65 transition-all duration-500" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <h3 className="font-display text-3xl md:text-4xl font-light text-white tracking-wide drop-shadow-lg">
          {category.name}
        </h3>
        <span className="text-xs tracking-[0.15em] uppercase text-white/80 mt-1.5 block drop-shadow-md">
          {imageCount} {imageCount === 1 ? "photo" : "photos"}
        </span>
      </div>

      {/* Arrow indicator */}
      <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white opacity-0 translate-x-[-5px] translate-y-[5px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-400 ease-out">
        <ArrowUpRight size={16} />
      </div>
    </Link>
  );
}
