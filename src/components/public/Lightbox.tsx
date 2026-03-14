"use client";

import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { optimizedUrl } from "@/lib/image-url";

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
  const navigate = useCallback(
    (dir: number) => {
      const next =
        (currentIndex + dir + images.length) % images.length;
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

  const current = images[currentIndex];
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
        src={optimizedUrl(current.url)}
        alt={current.title || "Photo"}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-sm"
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
