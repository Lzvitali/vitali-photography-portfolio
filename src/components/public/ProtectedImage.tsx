"use client";

import { optimizedUrl } from "@/lib/image-url";

interface ProtectedImageProps {
  src: string;
  alt: string;
  focalX?: number;
  focalY?: number;
  onClick?: () => void;
  className?: string;
}

export default function ProtectedImage({
  src,
  alt,
  focalX = 50,
  focalY = 50,
  onClick,
  className = "",
}: ProtectedImageProps) {
  return (
    <div
      className={`image-protect relative overflow-hidden group cursor-pointer ${className}`}
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute inset-0 z-10" />
      <img
        src={optimizedUrl(src)}
        alt={alt}
        className="w-full h-auto block transition-transform duration-600 ease-out group-hover:scale-[1.03]"
        style={{ objectPosition: `${focalX}% ${focalY}%` }}
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}
