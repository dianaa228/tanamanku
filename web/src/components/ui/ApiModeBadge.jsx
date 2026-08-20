import { useEffect, useState } from 'react'
import { apiMode, onModeChange } from '../../services/api/client'
import { cx } from '../../utils/format'

/** Indikator kecil: mode 'api' (backend Laravel) atau 'mock' (demo lokal). */
export default function ApiModeBadge() {
  const [mode, setMode] = useState(apiMode())

  useEffect(() => onModeChange(() => setMode(apiMode())), [])

  return (
    <div
      title="Sumber data web"
      className={cx(
        'fixed bottom-[4.5rem] left-3 z-30 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-soft backdrop-blur md:bottom-4',
        mode === 'api'
          ? 'bg-leaf-700/95 text-white'
          : 'bg-sun-300/95 text-soil-900',
      )}
    >
      <span
        className={cx(
          'h-2 w-2 rounded-full',
          mode === 'api' ? 'animate-pulse bg-lime-300' : 'bg-soil-700',
        )}
      />
      {mode === 'api' ? 'Terhubung ke API' : 'Mode demo (mock)'}
    </div>
  )
}
