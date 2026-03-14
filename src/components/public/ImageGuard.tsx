"use client";

import { useEffect } from "react";

export default function ImageGuard() {
  useEffect(() => {
    function blockSave(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
      }
    }

    function blockDrag(e: DragEvent) {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
      }
    }

    document.addEventListener("keydown", blockSave);
    document.addEventListener("dragstart", blockDrag);
    return () => {
      document.removeEventListener("keydown", blockSave);
      document.removeEventListener("dragstart", blockDrag);
    };
  }, []);

  return null;
}
