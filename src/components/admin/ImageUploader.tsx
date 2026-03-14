"use client";

import { useCallback, useState } from "react";
import { Upload, AlertCircle, Loader2 } from "lucide-react";

interface UploadResult {
  url: string;
  public_id: string;
  width: number;
  height: number;
}

interface ImageUploaderProps {
  onUpload: (result: UploadResult) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const MAX_SIZE = 10 * 1024 * 1024;

  const uploadFile = useCallback(
    async (file: File) => {
      setError("");

      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return;
      }

      if (file.size > MAX_SIZE) {
        setError("File exceeds 10MB limit. Please compress it first.");
        return;
      }

      setUploading(true);
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const progressInterval = setInterval(() => {
          setProgress((p) => Math.min(p + 10, 90));
        }, 200);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        setProgress(100);
        const result = await res.json();
        onUpload(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => uploadFile(file));
    },
    [uploadFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      files.forEach((file) => uploadFile(file));
      e.target.value = "";
    },
    [uploadFile]
  );

  return (
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
      {uploading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-neutral-400" />
          <p className="text-sm text-neutral-500">Uploading... {progress}%</p>
          <div className="w-48 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
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
          <p className="text-xs text-neutral-400">Max 10MB per file</p>
        </>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-1.5 justify-center text-red-500 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}
