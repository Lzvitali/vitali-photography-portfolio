"use client";

import Link from "next/link";
import type { CategoryCardProps } from "@/lib/types";
import { useCardCover } from "./useCardCover";

export default function AlbumCard({
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
      className={`group relative block transition-transform duration-300 hover:-translate-y-1 ${className} ${
        visible ? "animate-fadeUp" : "opacity-0"
      }`}
    >
      {/* Page edges - visible behind the cover like a thick book */}
      <div className="absolute -right-[3px] top-[6px] bottom-[2px] w-[5px] rounded-r-[2px] bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-600 dark:to-neutral-700" />
      <div className="absolute -right-[6px] top-[10px] bottom-[6px] w-[4px] rounded-r-[2px] bg-gradient-to-r from-neutral-300 to-neutral-350 dark:from-neutral-650 dark:to-neutral-700 opacity-70" />
      <div className="absolute left-[6px] -bottom-[3px] right-[8px] h-[5px] rounded-b-[2px] bg-gradient-to-b from-neutral-200 to-neutral-300 dark:from-neutral-600 dark:to-neutral-700" />
      <div className="absolute left-[10px] -bottom-[6px] right-[14px] h-[4px] rounded-b-[2px] bg-gradient-to-b from-neutral-300 to-neutral-350 dark:from-neutral-650 dark:to-neutral-700 opacity-70" />

      {/* Spine */}
      <div className="absolute -left-[7px] top-[3px] bottom-[3px] w-[8px] rounded-l-[3px] bg-gradient-to-r from-neutral-400 via-neutral-350 to-neutral-300 dark:from-neutral-500 dark:via-neutral-550 dark:to-neutral-600 shadow-md" />

      {/* Book cover */}
      <div className="rounded-[3px] shadow-lg overflow-hidden relative border border-black/5 dark:border-white/5">
        {/* Spine inner crease */}
        <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-r from-black/15 via-black/05 to-transparent z-[2]" />

        {/* Cover image */}
        <div className="aspect-[4/3] relative">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: `${focalX}% ${focalY}%` }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800" />
          )}

          {/* Gradient + info */}
          <div className="absolute inset-x-0 bottom-0 pt-16 pb-4 px-5 bg-gradient-to-t from-black/60 via-black/25 to-transparent z-[1]">
            <h3 className="font-display text-3xl md:text-4xl font-light text-white tracking-wide drop-shadow-lg">
              {category.name}
            </h3>
            <span className="text-xs tracking-[0.15em] uppercase text-white/80 mt-1.5 block drop-shadow-md">
              {imageCount} {imageCount === 1 ? "photo" : "photos"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
