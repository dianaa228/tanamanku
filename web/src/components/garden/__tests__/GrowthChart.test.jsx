import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import GrowthChart from '../GrowthChart'

const mockLogs = [
  { date: '2026-08-01', height: 10 },
  { date: '2026-08-08', height: 15 },
  { date: '2026-08-15', height: 22 },
  { date: '2026-08-22', height: 28 },
]

function renderChart(logs = mockLogs) {
  return render(<GrowthChart logs={logs} />)
}

describe('GrowthChart', () => {
  it('renders SVG chart', () => {
    const { container } = renderChart()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders all data point height labels', () => {
    renderChart()
    expect(screen.getByText('10 cm')).toBeInTheDocument()
    expect(screen.getByText('15 cm')).toBeInTheDocument()
    expect(screen.getByText('22 cm')).toBeInTheDocument()
    expect(screen.getByText('28 cm')).toBeInTheDocument()
  })

  it('renders date labels', () => {
    renderChart()
    expect(screen.getByText('1 Agu')).toBeInTheDocument()
    expect(screen.getByText('8 Agu')).toBeInTheDocument()
    expect(screen.getByText('15 Agu')).toBeInTheDocument()
    expect(screen.getByText('22 Agu')).toBeInTheDocument()
  })

  it('renders growth summary text', () => {
    renderChart()
    expect(screen.getByText(/Pertumbuhan 10 cm → 28 cm/)).toBeInTheDocument()
  })

  it('renders with single data point', () => {
    renderChart([{ date: '2026-08-22', height: 20 }])
    expect(screen.getByText('20 cm')).toBeInTheDocument()
    expect(screen.getByText(/Pertumbuhan 20 cm → 20 cm/)).toBeInTheDocument()
  })

  it('renders grid lines', () => {
    const { container } = renderChart()
    const lines = container.querySelectorAll('line')
    // 3 grid lines (0.25, 0.5, 0.75)
    expect(lines.length).toBe(3)
  })

  it('renders polyline for the data', () => {
    const { container } = renderChart()
    const polyline = container.querySelector('polyline')
    expect(polyline).toBeInTheDocument()
  })

  it('renders data point circles', () => {
    const { container } = renderChart()
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBe(mockLogs.length)
  })

  it('renders gradient fill area', () => {
    const { container } = renderChart()
    const area = container.querySelector('path')
    expect(area).toBeInTheDocument()
    expect(area.getAttribute('fill')).toBe('url(#growth-fill)')
  })

  it('renders gradient definition', () => {
    const { container } = renderChart()
    const gradient = container.querySelector('#growth-fill')
    expect(gradient).toBeInTheDocument()
  })

  it('renders with two data points', () => {
    renderChart([
      { date: '2026-08-01', height: 10 },
      { date: '2026-08-15', height: 20 },
    ])
    expect(screen.getByText('10 cm')).toBeInTheDocument()
    expect(screen.getByText('20 cm')).toBeInTheDocument()
    expect(screen.getByText(/Pertumbuhan 10 cm → 20 cm/)).toBeInTheDocument()
  })
})
