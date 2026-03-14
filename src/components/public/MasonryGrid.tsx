"use client";

import { useState, useEffect, useRef } from "react";
import ProtectedImage from "./ProtectedImage";
import Lightbox from "./Lightbox";
import type { PortfolioImage } from "@/lib/types";

interface MasonryGridProps {
  images: PortfolioImage[];
}

export default function MasonryGrid({ images }: MasonryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-idx"));
            setVisibleItems((prev) => new Set(prev).add(idx));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [images]);

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-3 px-4 md:px-8 max-w-7xl mx-auto pb-12">
        {images
          .sort((a, b) => a.order - b.order)
          .map((img, i) => (
            <div
              key={img.id}
              ref={(el) => { itemRefs.current[i] = el; }}
              data-idx={i}
              className={`break-inside-avoid mb-2 md:mb-3 rounded-sm overflow-hidden transition-all duration-600 ${
                visibleItems.has(i)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: `${(i % 4) * 80}ms` }}
            >
              <ProtectedImage
                src={img.url}
                alt={img.title || "Photo"}
                focalX={img.focalPoint?.x}
                focalY={img.focalPoint?.y}
                onClick={() => setLightboxIndex(i)}
              />
            </div>
          ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images.sort((a, b) => a.order - b.order)}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
