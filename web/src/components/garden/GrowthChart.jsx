const W = 320
const H = 140
const PAD = 28

export default function GrowthChart({ logs }) {
  const points = logs.map((l) => l.height)
  const min = Math.min(...points) - 2
  const max = Math.max(...points) + 2
  const range = max - min || 1

  const coords = logs.map((l, i) => {
    const x = PAD + (i / Math.max(logs.length - 1, 1)) * (W - PAD * 2)
    const y = H - PAD - ((l.height - min) / range) * (H - PAD * 2)
    return { x, y, height: l.height, date: l.date }
  })

  const line = coords.map((c) => `${c.x},${c.y}`).join(' ')
  const area = `M ${coords[0].x} ${H - PAD} L ${line.split(' ').join(' L ')} L ${coords[coords.length - 1].x} ${H - PAD} Z`

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#419a67" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#419a67" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={PAD}
            x2={W - PAD}
            y1={H - PAD - (H - PAD * 2) * f}
            y2={H - PAD - (H - PAD * 2) * f}
            stroke="#c2e5cf"
            strokeDasharray="4 6"
            strokeWidth="1"
          />
        ))}
        <path d={area} fill="url(#growth-fill)" />
        <polyline points={line} fill="none" stroke="#2f7c52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="4" fill="#fff" stroke="#2f7c52" strokeWidth="2.5" />
            <text x={c.x} y={c.y - 10} textAnchor="middle" className="fill-leaf-900" fontSize="10" fontWeight="700">
              {c.height} cm
            </text>
            <text x={c.x} y={H - 8} textAnchor="middle" className="fill-leaf-900/50" fontSize="9">
              {new Date(c.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
            </text>
          </g>
        ))}
      </svg>
      <p className="mt-1 text-center text-xs text-leaf-900/50">
        Pertumbuhan {coords[0]?.height} cm → {coords[coords.length - 1]?.height} cm 💪
      </p>
    </div>
  )
}
