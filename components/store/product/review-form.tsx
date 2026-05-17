"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Upload, X, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

type Props = {
  productId: string;
  onSuccess: () => void;
};

export default function ReviewForm({ productId, onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadPhoto(file: File): Promise<string | null> {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      toast.error("Upload failed");
      return null;
    }

    const data = await res.json();
    return data.url;
  }

  async function handlePhotoUpload(files: FileList) {
    if (photos.length >= 3) {
      toast.error("Maximum 3 photos allowed");
      return;
    }
    const remaining = 3 - photos.length;
    const toUpload = Array.from(files).slice(0, remaining);

    setUploading(true);
    try {
      const urls = await Promise.all(toUpload.map(uploadPhoto));
      const valid = urls.filter(Boolean) as string[];
      if (valid.length > 0) {
        setPhotos((p) => [...p, ...valid]);
        toast.success(
          `${valid.length} photo${valid.length > 1 ? "s" : ""} uploaded`,
        );
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!body.trim()) {
      toast.error("Please write a review");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, body, photos }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      setSubmitted(true);
      toast.success("Review submitted! It will appear after approval.");
      setTimeout(onSuccess, 2000);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 py-8 text-center"
      >
        <div className="w-12 h-12 bg-brand-900 flex items-center justify-center">
          <Check size={22} strokeWidth={2} className="text-brand-100" />
        </div>
        <p className="font-serif text-xl text-brand-900">Thank you!</p>
        <p className="text-xs text-brand-500 tracking-wide">
          Your review has been submitted and will appear after approval.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Star Rating */}
      <div>
        <p className="text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-3">
          Your Rating *
        </p>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={28}
                strokeWidth={1.5}
                className={`transition-colors ${
                  star <= (hover || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-brand-300"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-xs text-brand-500 tracking-wide self-center">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
          Review Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
          placeholder="Summarize your experience"
          maxLength={100}
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
          Your Review *
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide resize-none"
          placeholder="Share your experience with this product — fit, quality, styling..."
          maxLength={500}
        />
        <p className="text-[9px] text-brand-400 tracking-wide mt-1 text-right">
          {body.length}/500
        </p>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
          Add Photos (optional — max 3)
        </label>

        <div className="flex gap-2 flex-wrap">
          {/* Existing photos */}
          {photos.map((url, i) => (
            <div key={url} className="relative w-20 h-24 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() =>
                  setPhotos((p) => p.filter((_, idx) => idx !== i))
                }
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} strokeWidth={2} />
              </button>
            </div>
          ))}

          {/* Upload button */}
          {photos.length < 3 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="w-20 h-24 border-2 border-dashed border-brand-300 flex flex-col items-center justify-center gap-1 hover:border-brand-500 hover:bg-brand-50 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2
                  size={16}
                  strokeWidth={1.5}
                  className="text-brand-400 animate-spin"
                />
              ) : (
                <>
                  <Upload
                    size={16}
                    strokeWidth={1.5}
                    className="text-brand-400"
                  />
                  <span className="text-[9px] text-brand-400 tracking-wide">
                    Add Photo
                  </span>
                </>
              )}
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) =>
              e.target.files && handlePhotoUpload(e.target.files)
            }
          />
        </div>

        <p className="text-[9px] text-brand-400 tracking-wide mt-2">
          Photos help other customers. Max 5MB each.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="w-full bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-4 hover:bg-brand-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Review"
        )}
      </button>
    </form>
  );
}
