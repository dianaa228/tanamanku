import { daysUntil, formatDate } from '../../utils/format'
import { CARE_TYPES } from '../../types/constants'
import Button from '../ui/Button'
import { cx } from '../../utils/format'

export default function CareReminder({ reminder, onDone, onToggle }) {
  const care = CARE_TYPES[reminder.type]
  if (!care) return null
  const due = daysUntil(reminder.nextDue)
  const overdue = due <= 0

  return (
    <div
      className={cx(
        'flex items-center gap-3 rounded-2xl border p-3.5 transition',
        overdue
          ? 'border-rose-200 bg-rose-50/60'
          : due <= 2
            ? 'border-sun-200 bg-sun-100/40'
            : 'border-leaf-100 bg-white',
      )}
    >
      <span className={cx('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl', care.chip)}>
        {care.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-forest">{care.label}</p>
          <span className={cx('rounded-full px-2 py-0.5 text-[10px] font-bold', care.chip)}>
            tiap {reminder.frequency} hari
          </span>
        </div>
        <p className={cx('text-xs font-semibold', overdue ? 'text-rose-600' : 'text-leaf-900/50')}>
          {overdue ? `Jatuh tempo hari ini! Terakhir ${formatDate(reminder.lastDoneAt || '2026-08-01')}` : `Jatuh tempo ${due === 1 ? 'besok' : `${due} hari lagi`} (${formatDate(reminder.nextDue)})`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          onClick={() => onToggle?.(reminder.id)}
          className={cx('rounded-full p-2 text-lg transition hover:bg-white/70', reminder.isActive ? '' : 'opacity-30 grayscale')}
          title={reminder.isActive ? 'Nonaktifkan' : 'Aktifkan'}
        >
          🔔
        </button>
        <Button size="xs" variant={overdue ? 'primary' : 'soft'} onClick={() => onDone?.(reminder)}>
          ✓ Selesai
        </Button>
      </div>
    </div>
  )
}
