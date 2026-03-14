"use client";

import Link from "next/link";
import type { CategoryCardProps } from "@/lib/types";
import { useCardCover } from "./useCardCover";

export default function StackCard({
  category,
  coverImage,
  imageCount,
  className = "",
}: CategoryCardProps) {
  const { ref, visible, coverSrc, focalX, focalY } = useCardCover(category, coverImage);

  const pos = { objectPosition: `${focalX}% ${focalY}%` };

  return (
    <Link
      ref={ref}
      href={`/${category.slug}`}
      className={`group relative block ${className} ${visible ? "animate-fadeUp" : "opacity-0"}`}
      style={{ perspective: "600px" }}
    >
      <div className="relative aspect-[4/5]">
        {/* Back layers */}
        {coverSrc && (
          <>
            <img
              src={coverSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover rounded transition-transform duration-400 brightness-[0.85] shadow-md"
              style={{
                ...pos,
                transform: "rotate(-3deg) translate(-4px, 4px)",
              }}
              loading="lazy"
              aria-hidden
            />
            <img
              src={coverSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover rounded transition-transform duration-400 brightness-[0.9] shadow-md"
              style={{
                ...pos,
                transform: "rotate(2deg) translate(3px, 2px)",
              }}
              loading="lazy"
              aria-hidden
            />
          </>
        )}

        {/* Top layer */}
        <div className="absolute inset-0 rounded overflow-hidden shadow-lg z-[2] transition-transform duration-400 group-hover:scale-[1.03]">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={category.name}
              className="w-full h-full object-cover"
              style={pos}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Info */}
        <div className="absolute bottom-4 left-4 z-[3]">
          <h3 className="font-display text-2xl md:text-3xl font-light text-white tracking-wide drop-shadow-lg">
            {category.name}
          </h3>
          <span className="text-[11px] tracking-[0.15em] uppercase text-white/75">
            {imageCount} {imageCount === 1 ? "photo" : "photos"}
          </span>
        </div>
      </div>
    </Link>
  );
}
