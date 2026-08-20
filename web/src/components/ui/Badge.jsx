import { cx } from '../../utils/format'

export default function Badge({ children, className, icon }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        className,
      )}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  )
}
