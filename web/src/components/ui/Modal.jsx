import { useEffect } from 'react'
import { cx } from '../../utils/format'

export default function Modal({ open, onClose, title, children, footer, className }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={cx(
          'relative z-10 w-full animate-pop rounded-t-3xl bg-[var(--bg-card)] shadow-lift sm:rounded-3xl backdrop-blur-xl',
          'max-h-[88vh] overflow-y-auto',
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex items-center justify-between border-b border-[var(--border-primary)] px-6 py-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-[var(--text-muted)] transition hover:bg-white/20 hover:text-[var(--text-primary)]"
              aria-label="Tutup"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-[var(--border-primary)] px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}
