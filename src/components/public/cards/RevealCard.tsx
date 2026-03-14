"use client";

import Link from "next/link";
import type { CategoryCardProps } from "@/lib/types";
import { useCardCover } from "./useCardCover";

export default function RevealCard({
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
      className={`group relative block overflow-hidden ${className} ${
        visible ? "animate-fadeUp" : "opacity-0"
      }`}
    >
      {/* Image */}
      <div className="aspect-[3/4]">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            style={{ objectPosition: `${focalX}% ${focalY}%` }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800" />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/15 group-hover:bg-black/40 transition-colors duration-400 flex flex-col items-center justify-center">
        <h3 className="font-display text-xl md:text-2xl font-light text-white tracking-[0.08em] uppercase opacity-90 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
          {category.name}
        </h3>
        <div className="w-10 h-px bg-white/60 my-2.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 delay-100" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/70 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-150">
          {imageCount} {imageCount === 1 ? "photo" : "photos"}
        </span>
      </div>
    </Link>
  );
}
