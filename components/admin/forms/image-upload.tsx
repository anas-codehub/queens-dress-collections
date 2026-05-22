"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  images: string[];
  onChange: (urls: string[]) => void;
  max?: number;
};

export default function ImageUpload({ images, onChange, max = 6 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File): Promise<string | null> {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${file.name} is too large — max 5MB`);
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Upload failed");
      return null;
    }

    const data = await res.json();
    return data.url;
  }

  async function handleFiles(files: FileList) {
    if (images.length >= max) {
      toast.error(`Maximum ${max} images allowed`);
      return;
    }

    const remaining = max - images.length;
    const toUpload = Array.from(files).slice(0, remaining);

    if (toUpload.length === 0) return;

    setUploading(true);
    try {
      const urls = await Promise.all(toUpload.map(uploadFile));
      const valid = urls.filter(Boolean) as string[];
      if (valid.length > 0) {
        onChange([...images, ...valid]);
        toast.success(
          `${valid.length} image${valid.length > 1 ? "s" : ""} uploaded!`,
        );
      }
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function moveImage(from: number, to: number) {
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Upload Area */}
      {images.length < max && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors ${
            uploading
              ? "opacity-60 cursor-not-allowed border-brand-300"
              : dragOver
                ? "border-brand-700 bg-brand-100 cursor-pointer"
                : "border-brand-300 hover:border-brand-500 hover:bg-brand-50 cursor-pointer"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2
                size={24}
                strokeWidth={1.5}
                className="text-brand-500 animate-spin"
              />
              <p className="text-xs text-brand-500 tracking-wide">
                Uploading...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} strokeWidth={1.5} className="text-brand-400" />
              <p className="text-xs text-brand-600 tracking-wide">
                Drop images here or{" "}
                <span className="text-brand-900 underline">browse</span>
              </p>
              <p className="text-[10px] text-brand-400 tracking-wide">
                PNG, JPG, WEBP — max 5MB each — up to {max} images
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          <AnimatePresence>
            {images.map((url, i) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative group aspect-[3/4] bg-brand-100 overflow-hidden"
              >
                <img
                  src={url}
                  alt={`Product image ${i + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary badge */}
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[8px] bg-brand-900 text-brand-100 px-1.5 py-0.5 tracking-wide">
                    Primary
                  </span>
                )}

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Move left */}
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(i, i - 1)}
                      className="w-7 h-7 bg-white/90 text-brand-900 flex items-center justify-center text-xs hover:bg-white transition-colors font-medium"
                      title="Move left"
                    >
                      ←
                    </button>
                  )}

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="w-7 h-7 bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Remove"
                  >
                    <X size={12} strokeWidth={2} />
                  </button>

                  {/* Move right */}
                  {i < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(i, i + 1)}
                      className="w-7 h-7 bg-white/90 text-brand-900 flex items-center justify-center text-xs hover:bg-white transition-colors font-medium"
                      title="Move right"
                    >
                      →
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {images.length > 0 && (
        <p className="text-[10px] text-brand-400 tracking-wide">
          First image is the primary shown on store. Hover to reorder or remove.
          {images.length < max && ` You can add ${max - images.length} more.`}
        </p>
      )}
    </div>
  );
}
