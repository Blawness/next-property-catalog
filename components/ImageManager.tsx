"use client"

import Image from "next/image"
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface ImageManagerProps {
  imageUrls: string[]
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>
  onError: (msg: string) => void
}

export default function ImageManager({ imageUrls, setImageUrls, onError }: ImageManagerProps) {
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
        </div>
      )}

      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <UploadButton<OurFileRouter, "propertyImages">
          endpoint="propertyImages"
          onClientUploadComplete={(res) => {
            setImageUrls((prev) => [...prev, ...res.map((r) => r.url)])
          }}
          onUploadError={(err) => onError(`Upload error: ${err.message}`)}
          className="uploadthing-button"
          appearance={{
            button:
              "bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ut-ready:bg-amber-500 ut-uploading:bg-amber-400 ut-uploading:cursor-not-allowed",
            container: "",
            allowedContent: "text-muted-foreground text-xs",
          }}
        />
      </div>
    </div>
  )
}
