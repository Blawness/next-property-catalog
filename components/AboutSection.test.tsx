import { render, screen } from '@testing-library/react'
import AboutSection from '@/components/AboutSection'

describe('AboutSection', () => {
  it('renders heading, body, and 3 stats', () => {
    render(<AboutSection />)
    expect(screen.getByText(/Tentang TAP CATALOG/)).toBeInTheDocument()
    expect(screen.getByText(/katalog properti modern/)).toBeInTheDocument()
    expect(screen.getByText('15.000+')).toBeInTheDocument()
    expect(screen.getByText('34')).toBeInTheDocument()
    expect(screen.getByText('500+')).toBeInTheDocument()
  })
})
