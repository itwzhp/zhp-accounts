import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import Home from './Home.svelte'

describe('Home', () => {
  it('should render the main heading', () => {
    render(Home)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('ZHP Accounts')
  })

  it.todo('should render info cards')

  it.todo('should have links to external resources')

  it.todo('should be accessible')
})
