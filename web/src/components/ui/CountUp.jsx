import { useEffect, useRef, useState } from 'react'

/**
 * CountUp – animates a number from 0 to `end` when scrolled into view.
 * Supports suffixes like "+", "rb+", "jt+".
 *
 * Props:
 *  - end: target number (e.g. 27, 6, 10000)
 *  - suffix: string appended after the number (default: "+")
 *  - duration: animation duration in ms (default: 1500)
 *  - className: optional extra classes
 *  - label: accessible label
 */
export default function CountUp({ end, suffix = '+', duration = 1500, className, label }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState('0')
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const formatNumber = (n) => {
      if (n >= 1000000) return `${Math.floor(n / 1000000)}jt`
      if (n >= 1000) return `${Math.floor(n / 1000)}rb`
      return `${n}`
    }

    const animate = () => {
      if (hasAnimated.current) return
      hasAnimated.current = true

      const startTime = performance.now()
      const step = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.floor(eased * end)
        setDisplay(formatNumber(current))
        if (progress < 1) {
          requestAnimationFrame(step)
        } else {
          setDisplay(formatNumber(end))
        }
      }
      requestAnimationFrame(step)
    }

    if (!('IntersectionObserver' in window)) {
      setDisplay(formatNumber(end))
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate()
          io.unobserve(el)
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className={className} aria-label={label}>
      {display}{suffix}
    </span>
  )
}
