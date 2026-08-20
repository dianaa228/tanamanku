import { cx } from '../../utils/format'
import { SORT_OPTIONS } from '../../types/constants'

export default function ProductFilter({ categories, active, onChange }) {
  const set = (key, value) => onChange({ ...active, [key]: value })

  return (
    <aside className="space-y-6">
      {/* Kategori */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-leaf-900/50">Kategori</h3>
        <div className="space-y-1">
          <button
            onClick={() => set('category', '')}
            className={cx(
              'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition',
              !active.category ? 'bg-leaf-600 text-white shadow-soft' : 'text-leaf-900/70 hover:bg-leaf-50',
            )}
          >
            <span>🌐</span> Semua Produk
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => set('category', c.slug)}
              className={cx(
                'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition',
                active.category === c.slug ? 'bg-leaf-600 text-white shadow-soft' : 'text-leaf-900/70 hover:bg-leaf-50',
              )}
            >
              <span className="flex items-center gap-2.5">
                <span>{c.icon}</span> {c.name}
              </span>
              <span className={cx('text-xs', active.category === c.slug ? 'text-white/70' : 'text-leaf-900/35')}>{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tingkat perawatan */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-leaf-900/50">Tingkat Perawatan</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: '', label: 'Semua', icon: '✨' },
            { value: 'mudah', label: 'Mudah', icon: '🌱' },
            { value: 'sedang', label: 'Sedang', icon: '🌿' },
            { value: 'sulit', label: 'Sulit', icon: '🪴' },
          ].map((o) => (
            <button
              key={o.value}
              onClick={() => set('care', o.value)}
              className={cx(
                'rounded-full px-3.5 py-1.5 text-xs font-semibold transition',
                active.care === o.value
                  ? 'bg-leaf-700 text-white shadow-soft'
                  : 'bg-white text-leaf-800 ring-1 ring-leaf-200 hover:bg-leaf-50',
              )}
            >
              {o.icon} {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Urutkan */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-leaf-900/50">Urutkan</h3>
        <select
          value={active.sort}
          onChange={(e) => set('sort', e.target.value)}
          className="w-full rounded-xl border border-leaf-200 bg-white px-3 py-2.5 text-sm font-medium text-leaf-900 shadow-sm focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-200"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  )
}
