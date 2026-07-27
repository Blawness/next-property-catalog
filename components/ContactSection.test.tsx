import { render, screen } from '@testing-library/react'
import { toast } from 'sonner'
import ContactSection from '@/components/ContactSection'

jest.mock('sonner', () => ({
  toast: { success: jest.fn() },
}))

describe('ContactSection', () => {
  it('renders Contact word, italic subtitle, 3-form fields, contact list, footer', () => {
    render(<ContactSection />)
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText(/Tell us what you are looking for/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Work email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('What are you looking for?')).toBeInTheDocument()
    expect(screen.getByText('hello@tapcatalog.com')).toBeInTheDocument()
    expect(screen.getByText(/\+62 21 5000 1200/)).toBeInTheDocument()
    expect(screen.getByText(/Sudirman 52, Jakarta/)).toBeInTheDocument()
    expect(screen.getByText(/© 2026 TAP Catalog/)).toBeInTheDocument()
  })
})
