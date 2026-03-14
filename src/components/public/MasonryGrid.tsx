"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import ProtectedImage from "./ProtectedImage";
import Lightbox from "./Lightbox";
import type { PortfolioImage } from "@/lib/types";

const GAP = 4;

interface Row {
  images: PortfolioImage[];
  indices: number[];
  height: number;
  isLast: boolean;
}

function computeRows(
  images: PortfolioImage[],
  containerWidth: number,
  targetHeight: number
): Row[] {
  if (containerWidth <= 0 || images.length === 0) return [];

  const maxHeight = targetHeight * 1.35;
  const rows: Row[] = [];
  let currentRow: PortfolioImage[] = [];
  let currentIndices: number[] = [];
  let ratioSum = 0;

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const ratio = (img.width || 4) / (img.height || 3);
    currentRow.push(img);
    currentIndices.push(i);
    ratioSum += ratio;

    const gaps = (currentRow.length - 1) * GAP;
    const rowWidth = ratioSum * targetHeight + gaps;

    if (rowWidth >= containerWidth && currentRow.length > 0) {
      const actualHeight = Math.min((containerWidth - gaps) / ratioSum, maxHeight);
      rows.push({
        images: [...currentRow],
        indices: [...currentIndices],
        height: actualHeight,
        isLast: false,
      });
      currentRow = [];
      currentIndices = [];
      ratioSum = 0;
    }
  }

  if (currentRow.length > 0) {
    const gaps = (currentRow.length - 1) * GAP;
    const naturalHeight = (containerWidth - gaps) / ratioSum;
    rows.push({
      images: currentRow,
      indices: currentIndices,
      height: Math.min(naturalHeight, targetHeight),
      isLast: true,
    });
  }

  return rows;
}

interface MasonryGridProps {
  images: PortfolioImage[];
}

export default function MasonryGrid({ images }: MasonryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const sorted = useMemo(
    () => [...images].sort((a, b) => a.order - b.order),
    [images]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const targetHeight = containerWidth < 640 ? 260 : 380;
  const rows = useMemo(
    () => computeRows(sorted, containerWidth, targetHeight),
    [sorted, containerWidth, targetHeight]
  );

  const setItemRef = useCallback(
    (idx: number, el: HTMLDivElement | null) => {
      if (el) itemRefs.current.set(idx, el);
      else itemRefs.current.delete(idx);
    },
    []
  );

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
  }, [rows]);

  return (
    <>
      <div
        ref={containerRef}
        className="px-4 md:px-8 max-w-7xl mx-auto pb-12"
      >
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex"
            style={{
              gap: GAP,
              marginBottom: GAP,
              height: row.height,
            }}
          >
            {row.images.map((img, imgIdx) => {
              const globalIdx = row.indices[imgIdx];
              const ratio = (img.width || 4) / (img.height || 3);
              const imgWidth = row.isLast
                ? ratio * row.height
                : undefined;

              return (
                <div
                  key={img.id}
                  ref={(el) => setItemRef(globalIdx, el)}
                  data-idx={globalIdx}
                  className={`overflow-hidden rounded-sm transition-all duration-500 ${
                    visibleItems.has(globalIdx)
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-[0.97]"
                  }`}
                  style={{
                    flex: row.isLast ? "none" : `${ratio} 1 0%`,
                    width: imgWidth,
                    height: row.height,
                    transitionDelay: `${(imgIdx % 5) * 60}ms`,
                  }}
                >
                  <ProtectedImage
                    src={img.url}
                    alt={img.title || "Photo"}
                    focalX={img.focalPoint?.x}
                    focalY={img.focalPoint?.y}
                    aspectRatio={ratio}
                    fill
                    onClick={() => setLightboxIndex(globalIdx)}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={sorted}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
