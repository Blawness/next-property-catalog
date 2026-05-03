import Image from "next/image"
import type { PropertyImage } from "@/lib/types"

interface PropertyGalleryProps {
  images: PropertyImage[]
  title: string
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const primaryImage = images.find((img) => img.isPrimary) ?? images[0]
  const otherImages = images.filter((img) => img.id !== primaryImage?.id)

  return (
    <div className="grid grid-cols-3 gap-2 h-72 sm:h-96 mb-6 rounded-xl overflow-hidden">
      <div className="col-span-2 relative bg-muted">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Tidak ada foto
          </div>
        )}
      </div>
      <div className="grid grid-rows-2 gap-2">
        {otherImages.slice(0, 2).map((img) => (
          <div key={img.id} className="relative bg-muted">
            <Image
              src={img.url}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
        {otherImages.length < 2 && (
          <div className="bg-muted rounded" />
        )}
      </div>
    </div>
  )
}
