import { render, screen } from '@testing-library/react'
import ContactSection from '@/components/ContactSection'

jest.mock('sonner', () => ({
  toast: { success: jest.fn() },
}))

describe('ContactSection', () => {
  it('renders huge Contact word, form and info', () => {
    render(<ContactSection />)
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByLabelText(/Nama/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByText(/halo@tapcatalog\.id/)).toBeInTheDocument()
  })
})
