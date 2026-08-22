import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../../ui/ScrollToTop', () => ({ default: () => null }))

import AuthLayout from '../AuthLayout'

function renderAuthLayout() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<div>Form Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('AuthLayout', () => {
  it('renders brand name on desktop panel', () => {
    renderAuthLayout()
    // Brand name appears in both the desktop panel and mobile header
    const tanamankuElements = screen.getAllByText('Tanamanku')
    expect(tanamankuElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders desktop brand panel with tagline', () => {
    renderAuthLayout()
    expect(screen.getByText(/kebun perkotaanmu/i)).toBeInTheDocument()
    expect(screen.getByText(/mulai dari satu daun/i)).toBeInTheDocument()
  })

  it('renders feature badges on desktop panel', () => {
    renderAuthLayout()
    expect(screen.getByText(/tanaman berkualitas/i)).toBeInTheDocument()
    expect(screen.getByText(/pengingat cerdas/i)).toBeInTheDocument()
    expect(screen.getByText(/komunitas hangat/i)).toBeInTheDocument()
  })

  it('renders copyright on desktop panel', () => {
    renderAuthLayout()
    expect(screen.getByText(/© 2026 Tanamanku/i)).toBeInTheDocument()
  })

  it('renders child content via Outlet', () => {
    renderAuthLayout()
    expect(screen.getByText('Form Content')).toBeInTheDocument()
  })

  it('renders plant emoji on desktop panel', () => {
    renderAuthLayout()
    expect(screen.getByText('🪴')).toBeInTheDocument()
  })
})
