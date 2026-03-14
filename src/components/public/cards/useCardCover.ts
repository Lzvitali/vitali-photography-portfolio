"use client";

import { useEffect, useRef, useState } from "react";
import type { Category, PortfolioImage } from "@/lib/types";
import { thumbnailUrl } from "@/lib/image-url";

export function useCardCover(category: Category, coverImage: PortfolioImage | null) {
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

  const focalX = category.coverFocalPoint?.x ?? coverImage?.focalPoint?.x ?? 50;
  const focalY = category.coverFocalPoint?.y ?? coverImage?.focalPoint?.y ?? 50;

  return { ref, visible, coverSrc, focalX, focalY };
}
