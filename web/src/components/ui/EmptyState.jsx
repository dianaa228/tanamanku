import Button from './Button'
import { cx } from '../../utils/format'

export default function EmptyState({ icon = '🪴', title, description, actionLabel, actionTo, onAction, className }) {
  return (
    <div className={cx('flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-[var(--border-primary)] bg-[var(--bg-card)] px-6 py-16 text-center backdrop-blur-sm', className)}>
      <div className="relative">
        <span className="absolute inset-0 -z-0 animate-float rounded-full bg-leaf-500/20 blur-2xl" style={{ inset: '1.5rem' }} />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[var(--bg-card)] text-6xl shadow-card ring-1 ring-[var(--border-primary)]">
          {icon}
        </span>
      </div>
      {title && <h3 className="display text-2xl font-semibold text-[var(--text-primary)]">{title}</h3>}
      {description && <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>}
      {(actionLabel && actionTo) || (actionLabel && onAction) ? (
        <Button to={actionTo} onClick={onAction} variant="primary" className="mt-1.5">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
