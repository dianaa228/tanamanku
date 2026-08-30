import Button from './Button'
import { cx } from '../../utils/format'

export default function EmptyState({ icon = '🪴', title, description, actionLabel, actionTo, onAction, className }) {
  return (
    <div className={cx('flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-leaf-200 bg-leaf-50/40 px-6 py-16 text-center dark:border-sage-700 dark:bg-sage-900/50', className)}>
      <div className="relative">
        <span className="absolute inset-0 -z-0 animate-float rounded-full bg-leaf-100 blur-2xl dark:bg-sage-800" style={{ inset: '1.5rem' }} />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white text-6xl shadow-card ring-1 ring-leaf-100 dark:bg-sage-800 dark:ring-sage-600">
          {icon}
        </span>
      </div>
      {title && <h3 className="display text-2xl font-semibold text-forest dark:text-white">{title}</h3>}
      {description && <p className="max-w-sm text-sm leading-relaxed text-muted dark:text-sage-400">{description}</p>}
      {(actionLabel && actionTo) || (actionLabel && onAction) ? (
        <Button to={actionTo} onClick={onAction} variant="primary" className="mt-1.5">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
