import { render, screen } from '@testing-library/react'
import PropertyCard from '@/components/PropertyCard'
import type { PropertyWithImages } from '@/lib/types'

const mockProperty: PropertyWithImages = {
  id: '1',
  title: 'Test Property',
  description: null,
  price: '1000000000',
  listingType: 'jual',
  type: 'rumah',
  city: 'Jakarta',
  address: null,
  lat: null,
  lng: null,
  images: [{ id: 'img1', propertyId: '1', url: 'test-image.jpg', isPrimary: true, order: 0 }],
  bedrooms: 3,
  bathrooms: 2,
  buildingArea: 100,
  landArea: 200,
  agentId: null,
  status: null,
  createdAt: null,
}

describe('PropertyCard', () => {
  it('renders property title', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText('Test Property')).toBeInTheDocument()
  })

  it('formats price correctly', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText('Rp 1.0 M')).toBeInTheDocument()
  })
})