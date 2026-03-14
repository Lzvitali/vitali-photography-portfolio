"use client";

import { useState, useRef, useCallback } from "react";
import { X, Check } from "lucide-react";
import type { FocalPoint } from "@/lib/types";

interface FocalPointPickerProps {
  imageUrl: string;
  initialPoint: FocalPoint;
  onSave: (point: FocalPoint) => void;
  onClose: () => void;
}

export default function FocalPointPicker({
  imageUrl,
  initialPoint,
  onSave,
  onClose,
}: FocalPointPickerProps) {
  const [point, setPoint] = useState<FocalPoint>(initialPoint);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const img = imgRef.current;
      if (!img) return;
      const rect = img.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPoint({ x: Math.round(x), y: Math.round(y) });
    },
    []
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 rounded-lg overflow-hidden max-w-3xl w-full shadow-xl animate-scaleIn">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-sm font-medium">
            Set Focal Point ({point.x}%, {point.y}%)
          </h3>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X size={16} />
            </button>
            <button
              onClick={() => onSave(point)}
              className="flex items-center gap-1 px-3 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded text-sm"
            >
              <Check size={14} />
              Save
            </button>
          </div>
        </div>
        <div
          className="relative cursor-crosshair select-none"
          onClick={handleClick}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Set focal point"
            className="w-full h-auto max-h-[70vh] object-contain"
            draggable={false}
          />
          <div
            className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <div className="absolute inset-0 border-2 border-white rounded-full shadow-lg" />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/50" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/50" />
          </div>
        </div>
        <p className="px-4 py-2 text-xs text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
          Click on the image to set where the focus should be when cropped for
          thumbnails.
        </p>
      </div>
    </div>
  );
}
