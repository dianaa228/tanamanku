import { cx } from '../../utils/format'

export default function Card({ children, className, hover = false, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cx(
        'rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-soft backdrop-blur-sm',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
