import { cx } from '../../utils/format'

export default function Rating({ value, size = 'sm', showValue = false, className }) {
  return (
    <span className={cx('inline-flex items-center gap-1', className)}>
      <span className={cx('flex text-sun-400', size === 'sm' ? 'text-xs' : 'text-sm')} aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= Math.round(value) ? '' : 'opacity-25'}>
            ★
          </span>
        ))}
      </span>
      {showValue && <span className="text-xs font-semibold text-leaf-900/70">{value.toFixed(1)}</span>}
    </span>
  )
}
