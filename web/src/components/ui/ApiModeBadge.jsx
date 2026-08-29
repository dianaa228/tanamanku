import { useEffect, useState } from 'react'
import { apiMode, onModeChange } from '../../services/api/client'
import { cx } from '../../utils/format'

/** Tiny badge: 'api' (Laravel backend) or 'mock' (local demo). */
export default function ApiModeBadge() {
  const [mode, setMode] = useState(apiMode())

  useEffect(() => onModeChange(() => setMode(apiMode())), [])

  return (
    <div
      title="Sumber data web"
      className={cx(
        'fixed bottom-3 left-3 z-30 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm backdrop-blur-md md:bottom-3',
        mode === 'api'
          ? 'bg-emerald-600/90 text-white/90'
          : 'bg-amber-400/90 text-amber-900',
      )}
    >
      <span
        className={cx(
          'h-1.5 w-1.5 rounded-full',
          mode === 'api' ? 'animate-pulse bg-emerald-300' : 'bg-amber-700',
        )}
      />
      {mode === 'api' ? 'API ✓' : 'Demo'}
    </div>
  )
}
