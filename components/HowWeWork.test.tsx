import { render, screen } from '@testing-library/react'
import HowWeWork from '@/components/HowWeWork'

describe('HowWeWork', () => {
  it('renders heading and 4 step titles', () => {
    render(<HowWeWork />)
    expect(screen.getByText('Bagaimana Kami Bekerja')).toBeInTheDocument()
    expect(screen.getByText('Konsultasi Gratis')).toBeInTheDocument()
    expect(screen.getByText('Cari & Pilih')).toBeInTheDocument()
    expect(screen.getByText('Verifikasi Data')).toBeInTheDocument()
    expect(screen.getByText('Hubungi Agen')).toBeInTheDocument()
  })

  it('renders 4 svg icons', () => {
    const { container } = render(<HowWeWork />)
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(4)
  })
})
