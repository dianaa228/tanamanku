export default function ProductSearch({ value, onChange }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-leaf-900/40">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari tanaman, pot, pupuk..."
        className="w-full rounded-2xl border border-leaf-200 bg-white py-3 pl-12 pr-4 text-sm shadow-soft transition placeholder:text-leaf-900/35 focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-200"
      />
    </div>
  )
}
