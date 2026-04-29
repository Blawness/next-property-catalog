import { render, screen } from '@testing-library/react'
import PropertyCard from '@/components/PropertyCard'

const mockProperty = {
  id: '1',
  title: 'Test Property',
  price: '1000000000',
  listingType: 'jual' as const,
  type: 'rumah' as const,
  city: 'Jakarta',
  images: [{ url: 'test-image.jpg', isPrimary: true }],
  bedrooms: 3,
  bathrooms: 2,
  buildingArea: 100,
  landArea: 200,
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