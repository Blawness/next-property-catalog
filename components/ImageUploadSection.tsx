"use client"

import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"
import { Label } from "@/components/ui/label"

interface ImageUploadSectionProps {
  imageUrls: string[]
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>
  onError: (msg: string) => void
}

export default function ImageUploadSection({ imageUrls, setImageUrls, onError }: ImageUploadSectionProps) {
  return (
    <div className="space-y-2 col-span-2">
      <Label>Foto Properti</Label>
      <UploadButton<OurFileRouter, "propertyImages">
        endpoint="propertyImages"
        onClientUploadComplete={(res) => {
          setImageUrls((prev) => [...prev, ...res.map((r) => r.url)])
        }}
        onUploadError={(err) => onError(`Upload error: ${err.message}`)}
      />
      {imageUrls.length > 0 && (
        <p className="text-sm text-muted-foreground">{imageUrls.length} foto terupload</p>
      )}
    </div>
  )
}
