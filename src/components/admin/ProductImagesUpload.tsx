"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { X, Upload } from "lucide-react";

type Signature = { cloud_name: string; api_key: string; timestamp: number; folder: string; signature: string };

export function ProductImagesUpload({ name, defaultValue = "" }: { name: string; defaultValue?: string }) {
  const [images, setImages] = useState<string[]>(
    defaultValue.split("\n").map((img) => img.trim()).filter(Boolean)
  );
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setStatus(`Preparing upload for ${files.length} file(s)…`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      const resourceType = file.type.startsWith("video/") ? "video" : "image";
      
      try {
        const signatureResponse = await fetch("/api/admin/media/signature", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ folder: "khadeeja/products", resourceType, format: extension, fileSize: file.size })
        });
        
        const signature = await signatureResponse.json() as Signature & { error?: string };
        if (!signatureResponse.ok) throw new Error(signature.error || "Upload is unavailable.");
        
        const payload = new FormData();
        payload.set("file", file);
        payload.set("api_key", signature.api_key);
        payload.set("timestamp", String(signature.timestamp));
        payload.set("folder", signature.folder);
        payload.set("signature", signature.signature);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloud_name)}/${resourceType}/upload`, {
          method: "POST",
          body: payload
        });
        
        const result = await response.json() as { secure_url?: string; error?: { message?: string } };
        if (!response.ok || !result.secure_url) throw new Error(result.error?.message || "Upload failed.");
        
        setImages((prev) => [...prev, result.secure_url!]);
        setStatus(`Upload complete (${i + 1}/${files.length})`);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Upload failed.");
      }
    }
    
    if (inputRef.current) inputRef.current.value = "";
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Hidden textarea to submit the actual newline-separated URL list */}
      <textarea name={name} value={images.join("\n")} readOnly className="sr-only" />
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {images.map((url, idx) => (
          <div key={idx} className="group relative aspect-3/4 overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute right-1 top-1 rounded-full bg-stone-900/80 p-1 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {idx === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-[#9c5247] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                Primary
              </span>
            )}
          </div>
        ))}
        
        <div 
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 bg-white hover:border-[#9c5247] hover:bg-stone-50 transition"
        >
          <Upload className="h-5 w-5 text-stone-400" />
          <span className="mt-1 text-xs font-semibold text-stone-600">Upload Images</span>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={upload}
            className="sr-only"
          />
        </div>
      </div>
      
      {status ? (
        <p className="text-xs text-stone-500" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}
