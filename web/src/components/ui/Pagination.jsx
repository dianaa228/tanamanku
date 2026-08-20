import { cx } from '../../utils/format'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Paginasi">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-xl p-2 text-leaf-700 transition hover:bg-leaf-100 disabled:opacity-30"
        aria-label="Halaman sebelumnya"
      >
        ←
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cx(
            'h-9 w-9 rounded-xl text-sm font-semibold transition',
            p === page ? 'bg-leaf-600 text-white shadow-soft' : 'text-leaf-800 hover:bg-leaf-100',
          )}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-xl p-2 text-leaf-700 transition hover:bg-leaf-100 disabled:opacity-30"
        aria-label="Halaman berikutnya"
      >
        →
      </button>
    </nav>
  )
}
