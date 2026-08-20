import { PLANT_STATUS } from '../../types/constants'
import { cx } from '../../utils/format'

export default function PlantStatus({ status, size = 'md' }) {
  const meta = PLANT_STATUS[status]
  if (!meta) return null
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        meta.chip,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
      )}
    >
      <span>{meta.icon}</span>
      {meta.label}
    </span>
  )
}
