import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import Home from './Home.svelte'

describe('Home', () => {
  it('should render first paragraph starting with "Związek Harcerstwa Polskiego"', () => {
    render(Home)
    const text = screen.getByText(/Związek\s+Harcerstwa\s+Polskiego/i)
    expect(text).toBeInTheDocument()
  })

  it('should hide "Aby założyć konto upewnij się" text right after render', () => {
    render(Home)
    const text = screen.getByText(/Aby założyć konto upewnij się/i)
    expect(text).toHaveClass('opacity-0')
    expect(text).not.toHaveClass('opacity-100')
  })

  it('should show "Aby założyć konto upewnij się" text after clicking "Nie mam konta"', async () => {
    const user = userEvent.setup()
    render(Home)
    
    const button = screen.getByRole('tab', { name: /Nie mam konta/i })
    await user.click(button)
    
    const text = screen.getByText(/Aby założyć konto upewnij się/i)
    expect(text).toHaveClass('opacity-100')
    expect(text).not.toHaveClass('opacity-0')
  })

  it('should render link in "Aby założyć konto..." paragraph after clicking "Nie mam konta"', async () => {
    const user = userEvent.setup()
    render(Home)
    
    const button = screen.getByRole('tab', { name: /Nie mam konta/i })
    await user.click(button)
    
    const link = screen.getByRole('link', { name: /formularz aktywacji konta/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', expect.stringContaining('forms.office.com'))
  })
})
