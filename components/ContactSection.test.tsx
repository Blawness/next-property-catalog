import { render, screen } from '@testing-library/react'
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
    expect(screen.getByText('tigaanakpropetindo@gmail.com')).toBeInTheDocument()
    expect(screen.getByText(/Yayasan Purna Bakti/)).toBeInTheDocument()
    expect(screen.getByText(/Menteng/)).toBeInTheDocument()
    expect(screen.getByText(/© 2026 TAP Catalog/)).toBeInTheDocument()
  })
})
