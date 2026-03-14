"use client";

import Link from "next/link";
import type { CategoryCardProps } from "@/lib/types";
import { useCardCover } from "./useCardCover";

const ROTATIONS = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "0.8deg"];

export default function PolaroidCard({
  category,
  coverImage,
  imageCount,
  className = "",
}: CategoryCardProps) {
  const { ref, visible, coverSrc, focalX, focalY } = useCardCover(category, coverImage);
  const rotation = ROTATIONS[Math.abs(category.order) % ROTATIONS.length];

  return (
    <Link
      ref={ref}
      href={`/${category.slug}`}
      className={`group block transition-all duration-400 origin-bottom ${className} ${
        visible ? "animate-fadeUp" : "opacity-0"
      }`}
      style={{ transform: `rotate(${rotation})` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "rotate(0deg) scale(1.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rotation})`;
      }}
    >
      <div className="bg-white dark:bg-neutral-100 p-3 pb-10 shadow-lg rounded-[2px]">
        {/* Photo */}
        <div className="aspect-square overflow-hidden rounded-[1px]">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={category.name}
              className="w-full h-full object-cover"
              style={{ objectPosition: `${focalX}% ${focalY}%` }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200" />
          )}
        </div>

        {/* Label */}
        <div className="text-center pt-3">
          <h3 className="font-display text-base md:text-lg font-normal text-neutral-800 tracking-wide">
            {category.name}
          </h3>
          <span className="text-[10px] tracking-[0.12em] uppercase text-neutral-400">
            {imageCount} {imageCount === 1 ? "photo" : "photos"}
          </span>
        </div>
      </div>
    </Link>
  );
}
