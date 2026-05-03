import { BedDouble, Bath, Maximize2 } from "lucide-react"

interface PropertySpecsProps {
  bedrooms: number | null
  bathrooms: number | null
  buildingArea: number | null
  landArea: number | null
}

export default function PropertySpecs({
  bedrooms,
  bathrooms,
  buildingArea,
  landArea,
}: PropertySpecsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {bedrooms != null && (
        <div className="text-center p-3 border rounded-lg">
          <BedDouble className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <p className="font-semibold">{bedrooms}</p>
          <p className="text-xs text-muted-foreground">Kamar Tidur</p>
        </div>
      )}
      {bathrooms != null && (
        <div className="text-center p-3 border rounded-lg">
          <Bath className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <p className="font-semibold">{bathrooms}</p>
          <p className="text-xs text-muted-foreground">Kamar Mandi</p>
        </div>
      )}
      {buildingArea != null && (
        <div className="text-center p-3 border rounded-lg">
          <Maximize2 className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <p className="font-semibold">{buildingArea} m²</p>
          <p className="text-xs text-muted-foreground">Luas Bangunan</p>
        </div>
      )}
      {landArea != null && (
        <div className="text-center p-3 border rounded-lg">
          <Maximize2 className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <p className="font-semibold">{landArea} m²</p>
          <p className="text-xs text-muted-foreground">Luas Tanah</p>
        </div>
      )}
    </div>
  )
}
