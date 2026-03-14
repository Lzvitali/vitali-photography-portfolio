"use client";

import Link from "next/link";
import type { CategoryCardProps } from "@/lib/types";
import { useCardCover } from "./useCardCover";

function SprocketHoles() {
  return (
    <div className="flex justify-around px-4 py-1.5">
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className="w-2.5 h-[7px] rounded-sm bg-neutral-700" />
      ))}
    </div>
  );
}

export default function FilmCard({
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
      className={`group block bg-neutral-900 rounded overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.25)] ${className} ${
        visible ? "animate-fadeUp" : "opacity-0"
      }`}
    >
      <SprocketHoles />

      {/* Frame */}
      <div className="relative mx-2.5">
        <div className="aspect-[16/10] overflow-hidden rounded-[1px]">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: `${focalX}% ${focalY}%` }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Info over image */}
        <div className="absolute bottom-2 left-2 z-[1]">
          <h3 className="font-display text-base md:text-lg font-light text-white tracking-wide">
            {category.name}
          </h3>
          <span className="text-[10px] tracking-[0.12em] uppercase text-white/60">
            {imageCount} {imageCount === 1 ? "photo" : "photos"}
          </span>
        </div>
      </div>

      {/* Footer strip */}
      <div className="px-4 py-1 flex justify-between items-center">
        <span className="text-[10px] text-neutral-500 tracking-wider font-mono">KODAK 400TX</span>
        <span className="text-[10px] text-neutral-500 tracking-wider font-mono">→ {imageCount}</span>
      </div>

      <SprocketHoles />
    </Link>
  );
}
