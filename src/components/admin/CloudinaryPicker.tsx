"use client";

import { useState } from "react";
import { X, Loader2, Link2, CheckCircle, AlertCircle } from "lucide-react";

interface ImportedImage {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

interface CloudinaryPickerProps {
  onImport: (images: ImportedImage[]) => void;
  onClose: () => void;
}

interface UrlStatus {
  url: string;
  state: "pending" | "done" | "error";
  error?: string;
}

export default function CloudinaryPicker({ onImport, onClose }: CloudinaryPickerProps) {
  const [urlText, setUrlText] = useState("");
  const [importing, setImporting] = useState(false);
  const [statuses, setStatuses] = useState<UrlStatus[]>([]);

  async function handleImport() {
    const urls = urlText
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && u.startsWith("http"));

    if (urls.length === 0) return;

    setImporting(true);
    setStatuses(urls.map((url) => ({ url, state: "pending" })));

    try {
      const res = await fetch("/api/cloudinary-browse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();

      if (data.error) {
        setStatuses(urls.map((url) => ({ url, state: "error", error: data.error })));
        setImporting(false);
        return;
      }

      const successful: ImportedImage[] = [];
      const finalStatuses: UrlStatus[] = [];

      for (const r of data.results) {
        if (r.error) {
          finalStatuses.push({ url: r.url, state: "error", error: r.error });
        } else {
          finalStatuses.push({ url: r.url, state: "done" });
          successful.push({
            secure_url: r.secure_url,
            public_id: r.public_id,
            width: r.width,
            height: r.height,
          });
        }
      }

      setStatuses(finalStatuses);

      if (successful.length > 0) {
        onImport(successful);
      }
    } catch (err) {
      setStatuses(
        urls.map((url) => ({
          url,
          state: "error",
          error: err instanceof Error ? err.message : "Network error",
        }))
      );
    }

    setImporting(false);
  }

  const hasResults = statuses.length > 0;
  const allDone = hasResults && statuses.every((s) => s.state !== "pending");
  const successCount = statuses.filter((s) => s.state === "done").length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 rounded-lg w-full max-w-xl mx-4 flex flex-col shadow-xl animate-scaleIn">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Link2 size={18} className="text-blue-500" />
            <h3 className="font-semibold">Import from URL</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-neutral-500 block mb-1.5">
              Paste image URLs (one per line)
            </label>
            <textarea
              value={urlText}
              onChange={(e) => setUrlText(e.target.value)}
              placeholder={"https://res.cloudinary.com/.../image.jpg\nhttps://example.com/photo.png"}
              rows={5}
              disabled={importing}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Cloudinary URLs are linked directly. Other URLs are uploaded to Cloudinary first.
            </p>
          </div>

          {statuses.length > 0 && (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {statuses.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs"
                >
                  {s.state === "pending" && (
                    <Loader2 size={14} className="animate-spin text-neutral-400 mt-0.5 flex-shrink-0" />
                  )}
                  {s.state === "done" && (
                    <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                  {s.state === "error" && (
                    <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-neutral-600 dark:text-neutral-400">
                      {s.url}
                    </p>
                    {s.error && (
                      <p className="text-red-500">{s.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-neutral-200 dark:border-neutral-800">
          {allDone && successCount > 0 && (
            <span className="text-xs text-green-600 mr-auto">
              {successCount} image{successCount > 1 ? "s" : ""} imported
            </span>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            {allDone ? "Done" : "Cancel"}
          </button>
          {!allDone && (
            <button
              onClick={handleImport}
              disabled={importing || urlText.trim().length === 0}
              className="px-4 py-1.5 text-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5"
            >
              {importing && <Loader2 size={14} className="animate-spin" />}
              {importing ? "Importing..." : "Import"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
