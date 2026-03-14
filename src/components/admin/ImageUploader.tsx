"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, AlertCircle, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface UploadResult {
  url: string;
  public_id: string;
  width: number;
  height: number;
}

interface ImageUploaderProps {
  onUpload: (result: UploadResult) => void;
}

interface FileStatus {
  name: string;
  state: "pending" | "uploading" | "done" | "error";
  error?: string;
}

const MAX_SIZE = 10 * 1024 * 1024;

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState<FileStatus[]>([]);
  const uploading = useRef(false);

  const processQueue = useCallback(
    async (files: File[]) => {
      const valid: File[] = [];
      const statuses: FileStatus[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          statuses.push({ name: file.name, state: "error", error: "Not an image" });
        } else if (file.size > MAX_SIZE) {
          statuses.push({ name: file.name, state: "error", error: "Exceeds 10MB" });
        } else {
          statuses.push({ name: file.name, state: "pending" });
          valid.push(file);
        }
      }

      setQueue(statuses);

      if (valid.length === 0) return;
      if (uploading.current) return;
      uploading.current = true;

      for (let i = 0; i < valid.length; i++) {
        const file = valid[i];
        const statusIdx = statuses.findIndex(
          (s) => s.name === file.name && s.state === "pending"
        );

        setQueue((prev) =>
          prev.map((s, idx) =>
            idx === statusIdx ? { ...s, state: "uploading" } : s
          )
        );

        try {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Upload failed");
          }

          const result = await res.json();
          onUpload(result);

          setQueue((prev) =>
            prev.map((s, idx) =>
              idx === statusIdx ? { ...s, state: "done" } : s
            )
          );
        } catch (err) {
          setQueue((prev) =>
            prev.map((s, idx) =>
              idx === statusIdx
                ? { ...s, state: "error", error: err instanceof Error ? err.message : "Failed" }
                : s
            )
          );
        }
      }

      uploading.current = false;

      setTimeout(() => {
        setQueue((prev) => {
          const hasErrors = prev.some((s) => s.state === "error");
          return hasErrors ? prev.filter((s) => s.state === "error") : [];
        });
      }, 2000);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      processQueue(Array.from(e.dataTransfer.files));
    },
    [processQueue]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processQueue(Array.from(e.target.files || []));
      e.target.value = "";
    },
    [processQueue]
  );

  const isUploading = queue.some((s) => s.state === "uploading" || s.state === "pending");
  const doneCount = queue.filter((s) => s.state === "done").length;
  const totalCount = queue.filter((s) => s.state !== "error" || !s.error).length;

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragging
            ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
            : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={24} className="animate-spin text-neutral-400" />
            <p className="text-sm text-neutral-500">
              Uploading {doneCount + 1} of {totalCount}...
            </p>
          </div>
        ) : (
          <>
            <Upload size={24} className="mx-auto mb-3 text-neutral-400" />
            <p className="text-sm text-neutral-500 mb-1">
              Drag & drop images here, or{" "}
              <label className="text-blue-500 hover:text-blue-600 cursor-pointer underline">
                browse
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-xs text-neutral-400">Max 10MB per file &middot; Multiple files supported</p>
          </>
        )}
      </div>

      {queue.length > 0 && (
        <div className="mt-3 space-y-1.5 max-h-40 overflow-y-auto">
          {queue.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs px-2 py-1.5 rounded bg-neutral-50 dark:bg-neutral-900/50"
            >
              {item.state === "uploading" && (
                <Loader2 size={12} className="animate-spin text-blue-500 flex-shrink-0" />
              )}
              {item.state === "pending" && (
                <div className="w-3 h-3 rounded-full border border-neutral-300 dark:border-neutral-600 flex-shrink-0" />
              )}
              {item.state === "done" && (
                <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
              )}
              {item.state === "error" && (
                <XCircle size={12} className="text-red-500 flex-shrink-0" />
              )}
              <span className="truncate flex-1 text-neutral-600 dark:text-neutral-400">
                {item.name}
              </span>
              {item.state === "error" && (
                <span className="text-red-500 flex-shrink-0">{item.error}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
