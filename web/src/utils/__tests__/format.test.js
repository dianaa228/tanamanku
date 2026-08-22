import { describe, it, expect } from 'vitest'
import { formatRupiah, formatDate, formatDateTime, timeAgo, cx, daysUntil, durationText } from '../format'

describe('formatRupiah', () => {
  it('formats number to IDR currency', () => {
    const result = formatRupiah(50000)
    expect(result).toMatch(/Rp[\s.]?50\.000/)
  })

  it('formats string number', () => {
    const result = formatRupiah('100000')
    expect(result).toMatch(/Rp[\s.]?100\.000/)
  })

  it('returns Rp0 for undefined/null', () => {
    expect(formatRupiah(undefined)).toMatch(/Rp[\s.]?0/)
    expect(formatRupiah(null)).toMatch(/Rp[\s.]?0/)
  })

  it('formats zero', () => {
    expect(formatRupiah(0)).toMatch(/Rp[\s.]?0/)
  })

  it('formats large numbers', () => {
    const result = formatRupiah(1000000)
    expect(result).toMatch(/Rp[\s.]?1\.000\.000/)
  })
})

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2026-01-15')
    expect(result).toContain('15')
    expect(result).toContain('2026')
  })
})

describe('formatDateTime', () => {
  it('formats ISO datetime with time', () => {
    const result = formatDateTime('2026-01-15T10:30:00')
    expect(result).toContain('15')
    expect(result).toContain('2026')
  })
})

describe('timeAgo', () => {
  it('returns "baru saja" for recent time', () => {
    const now = new Date().toISOString()
    expect(timeAgo(now)).toBe('baru saja')
  })

  it('returns minutes for times within an hour', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const result = timeAgo(fiveMinAgo)
    expect(result).toContain('menit')
  })

  it('returns hours for times within a day', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    const result = timeAgo(twoHoursAgo)
    expect(result).toContain('jam')
  })

  it('returns days for times within a week', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    const result = timeAgo(threeDaysAgo)
    expect(result).toContain('hari')
  })
})

describe('cx', () => {
  it('joins class names', () => {
    expect(cx('foo', 'bar')).toBe('foo bar')
  })

  it('filters falsy values', () => {
    expect(cx('foo', false, null, undefined, 'bar')).toBe('foo bar')
  })

  it('returns empty string for no args', () => {
    expect(cx()).toBe('')
  })
})

describe('daysUntil', () => {
  it('returns positive for future dates', () => {
    const future = new Date(Date.now() + 3 * 86400000).toISOString()
    expect(daysUntil(future)).toBe(3)
  })

  it('returns negative for past dates', () => {
    const past = new Date(Date.now() - 2 * 86400000).toISOString()
    expect(daysUntil(past)).toBe(-2)
  })
})

describe('durationText', () => {
  it('returns — for null/undefined', () => {
    expect(durationText(null)).toBe('—')
    expect(durationText(undefined)).toBe('—')
  })

  it('formats minutes only', () => {
    expect(durationText(30)).toBe('30 menit')
  })

  it('formats hours only', () => {
    expect(durationText(120)).toBe('2 jam')
  })

  it('formats hours and minutes', () => {
    expect(durationText(90)).toBe('1j 30m')
  })
})
