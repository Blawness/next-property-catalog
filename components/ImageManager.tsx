"use client"

import { useState } from "react"
import Image from "next/image"
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"
import { Label } from "@/components/ui/label"
import { X, Loader2 } from "lucide-react"

interface ImageManagerProps {
  imageUrls: string[]
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>
  onError: (msg: string) => void
}

export default function ImageManager({ imageUrls, setImageUrls, onError }: ImageManagerProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadingCount, setUploadingCount] = useState(0)

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <Label>Foto Properti ({imageUrls.length})</Label>

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {imageUrls.map((url, i) => (
            <div key={url + i} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
              <Image
                src={url}
                alt={`Foto ${i + 1}`}
                fill
                sizes="(max-width: 640px) 33vw, 20vw"
                className="object-cover"
              />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Utama
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {/* Uploading placeholders */}
          {uploading && Array.from({ length: uploadingCount }).map((_, i) => (
            <div key={`loading-${i}`} className="relative aspect-square rounded-lg overflow-hidden bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
              <Loader2 size={20} className="animate-spin text-amber-500" />
            </div>
          ))}
        </div>
      )}

      <div className={`border-2 border-dashed rounded-lg text-center transition-colors ${
        uploading
          ? "border-amber-300 bg-amber-50/50"
          : "border-border hover:border-amber-300 hover:bg-amber-50/30"
      }`}>
        {uploading ? (
          <div className="p-6 flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-amber-500" />
            <p className="text-sm font-medium text-amber-700">Mengupload...</p>
            <p className="text-xs text-amber-600/70">Jangan tutup halaman ini</p>
          </div>
        ) : (
          <div className="p-6">
            <UploadButton<OurFileRouter, "propertyImages">
              endpoint="propertyImages"
              onUploadBegin={() => {
                setUploading(true)
                setUploadingCount(0)
              }}
              onClientUploadComplete={(res) => {
                setImageUrls((prev) => [...prev, ...res.map((r) => r.ufsUrl)])
                setUploading(false)
              }}
              onUploadError={(err) => {
                onError(`Upload error: ${err.message}`)
                setUploading(false)
              }}
              onBeforeUploadBegin={(files) => {
                setUploadingCount(files.length)
                return files
              }}
              className="uploadthing-button"
              appearance={{
                button:
                  "bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ut-ready:bg-amber-500 ut-uploading:bg-amber-400 ut-uploading:cursor-not-allowed",
                container: "",
                allowedContent: "text-muted-foreground text-xs",
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
