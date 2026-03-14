"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { thumbnailUrl, lightboxUrl } from "@/lib/image-url";

interface LightboxProps {
  images: { url: string; title: string }[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const current = images[currentIndex];

  const [displaySrc, setDisplaySrc] = useState(() =>
    current ? thumbnailUrl(current.url) : ""
  );
  const [loaded, setLoaded] = useState(false);
  const preloadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!current) return;

    const thumb = thumbnailUrl(current.url);
    const hiRes = lightboxUrl(current.url);

    setDisplaySrc(thumb);
    setLoaded(false);

    const img = new Image();
    img.src = hiRes;
    img.onload = () => {
      setDisplaySrc(hiRes);
      setLoaded(true);
    };

    return () => {
      img.onload = null;
    };
  }, [currentIndex, current]);

  // Preload adjacent images after current finishes loading
  useEffect(() => {
    if (!loaded || images.length <= 1) return;

    const toPreload = [
      (currentIndex + 1) % images.length,
      (currentIndex - 1 + images.length) % images.length,
    ];

    for (const idx of toPreload) {
      const src = lightboxUrl(images[idx].url);
      if (!preloadedRef.current.has(src)) {
        preloadedRef.current.add(src);
        const img = new Image();
        img.src = src;
      }
    }
  }, [loaded, currentIndex, images]);

  const navigate = useCallback(
    (dir: number) => {
      const next = (currentIndex + dir + images.length) % images.length;
      onNavigate(next);
    },
    [currentIndex, images.length, onNavigate]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, navigate]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center animate-fadeIn"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/70 hover:text-white transition-opacity z-10"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-opacity p-2 z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-opacity p-2 z-10"
            aria-label="Next"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <img
        key={currentIndex}
        src={displaySrc}
        alt={current.title || "Photo"}
        className={`max-w-[90vw] max-h-[90vh] object-contain rounded-sm transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-90"
        }`}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-wide">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
