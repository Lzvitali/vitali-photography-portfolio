"use client";

import Link from "next/link";
import type { CategoryCardProps } from "@/lib/types";
import { useCardCover } from "./useCardCover";

export default function FolderCard({
  category,
  coverImage,
  imageCount,
  className = "",
}: CategoryCardProps) {
  const { ref, visible, coverSrc, focalX, focalY } = useCardCover(category, coverImage);

  return (
    <Link
      ref={ref}
      href={`/${category.slug}`}
      className={`group block transition-transform duration-300 hover:-translate-y-1 ${className} ${
        visible ? "animate-fadeUp" : "opacity-0"
      }`}
    >
      {/* Tab */}
      <div className="inline-block bg-neutral-200 dark:bg-neutral-700 px-4 py-1.5 rounded-t-md ml-3">
        <span className="font-display text-sm font-normal text-neutral-600 dark:text-neutral-300 tracking-wide">
          {category.name}
        </span>
      </div>

      {/* Folder body */}
      <div className="bg-neutral-200 dark:bg-neutral-700 rounded-tr-md rounded-b-md p-2 shadow-md relative">
        <div className="absolute top-0 left-2 right-2 h-px bg-black/5 dark:bg-white/5" />

        <div className="aspect-[16/10] rounded overflow-hidden relative">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: `${focalX}% ${focalY}%` }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-neutral-300 dark:bg-neutral-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          <span className="absolute bottom-2.5 right-3 text-[10px] tracking-[0.12em] uppercase text-white/85 drop-shadow">
            {imageCount} {imageCount === 1 ? "photo" : "photos"}
          </span>
        </div>
      </div>
    </Link>
  );
}
