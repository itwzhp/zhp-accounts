import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import Units from './Units.svelte'

// Mock the adapters module
vi.mock('@/lib/adapters', () => ({
  getBackendAdapter: vi.fn(() => ({
    getUnits: vi.fn().mockResolvedValue([])
  }))
}))

describe('Units', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the units heading', () => {
    render(Units)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Jednostki ZHP')
  })

  it.todo('should show loading state initially')

  it.todo('should render units after loading')

  it.todo('should filter units by search query')

  it.todo('should show empty state when no units match search')

  it.todo('should handle error state')
})
