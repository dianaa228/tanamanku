import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetSales = vi.fn()

vi.mock('../../../services/api/seller', () => ({
  sellerApi: {
    getSales: (...args) => mockGetSales(...args),
  },
}))

vi.mock('../../../components/ui/Loading', () => ({
  default: () => <div>Loading...</div>,
}))

vi.mock('../../../utils/format', () => ({
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
  cx: (...args) => args.filter(Boolean).join(' '),
}))

const mockSalesData = {
  totalRevenue: 5000000,
  totalOrders: 25,
  avgOrderValue: 200000,
  dailySales: [
    { date: '2026-08-16', total: 500000 },
    { date: '2026-08-17', total: 750000 },
    { date: '2026-08-18', total: 300000 },
  ],
  topProducts: [
    { name: 'Monstera Deliciosa', sold: 15, revenue: 1275000 },
    { name: 'Aloe Vera', sold: 10, revenue: 250000 },
  ],
}

import SellerSales from '../Sales'

function renderSales() {
  return render(
    <MemoryRouter>
      <SellerSales />
    </MemoryRouter>
  )
}

describe('Seller Sales Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetSales.mockReturnValue(new Promise(() => {}))
    renderSales()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders stats after loading', async () => {
    mockGetSales.mockResolvedValue({ data: mockSalesData })
    renderSales()

    await waitFor(() => {
      expect(screen.getByText('Total Pendapatan')).toBeInTheDocument()
    })

    expect(screen.getByText('Total Pesanan')).toBeInTheDocument()
    expect(screen.getByText('Rata-rata per Pesanan')).toBeInTheDocument()
  })

  it('displays correct revenue', async () => {
    mockGetSales.mockResolvedValue({ data: mockSalesData })
    renderSales()

    await waitFor(() => {
      expect(screen.getByText('Rp5.000.000')).toBeInTheDocument()
    })
  })

  it('displays total orders', async () => {
    mockGetSales.mockResolvedValue({ data: mockSalesData })
    renderSales()

    await waitFor(() => {
      expect(screen.getByText('25')).toBeInTheDocument()
    })
  })

  it('shows daily sales chart', async () => {
    mockGetSales.mockResolvedValue({ data: mockSalesData })
    renderSales()

    await waitFor(() => {
      expect(screen.getByText(/penjualan harian/i)).toBeInTheDocument()
    })
  })

  it('shows top products section', async () => {
    mockGetSales.mockResolvedValue({ data: mockSalesData })
    renderSales()

    await waitFor(() => {
      expect(screen.getByText(/produk terlaris/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/monstera/i)).toBeInTheDocument()
    expect(screen.getByText(/aloe vera/i)).toBeInTheDocument()
  })

  it('shows top product sold counts', async () => {
    mockGetSales.mockResolvedValue({ data: mockSalesData })
    renderSales()

    await waitFor(() => {
      expect(screen.getByText(/15 terjual/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/10 terjual/i)).toBeInTheDocument()
  })
})
