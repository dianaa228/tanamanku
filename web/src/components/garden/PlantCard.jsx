import { Link } from 'react-router-dom'
import { cx, daysUntil, formatDate } from '../../utils/format'
import PlantStatus from './PlantStatus'
import ProductVisual from '../product/ProductVisual'
import { CARE_TYPES } from '../../types/constants'

export default function PlantCard({ plant }) {
  const nextReminder = [...plant.reminders]
    .filter((r) => r.isActive)
    .sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue))[0]
  const dueDays = nextReminder ? daysUntil(nextReminder.nextDue) : null
  const care = nextReminder ? CARE_TYPES[nextReminder.type] : null

  return (
    <Link
      to={`/my-garden/${plant.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-sage-100 bg-warm-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-leaf-200 hover:shadow-card"
    >
      <div className="relative m-2 overflow-hidden rounded-2xl">
        <ProductVisual
          emoji={plant.species.emoji}
          gradient={plant.photoGradient || plant.species.gradient}
          className="h-36 w-full transition-transform duration-500 group-hover:scale-[1.05]"
          emojiClassName="text-6xl"
        />
        <div className="absolute left-2.5 top-2.5">
          <PlantStatus status={plant.status} size="sm" />
        </div>
        <span className="absolute bottom-2.5 right-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-leaf-900 shadow-sm backdrop-blur">
          {plant.height} cm
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold leading-snug text-forest transition group-hover:text-leaf-700">{plant.nickname}</h3>
            <p className="text-xs text-muted">{plant.species.name}</p>
            <p className="text-[11px] text-muted-light">📍 {plant.location}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-leaf-50 px-3 py-2.5">
          {nextReminder && care ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-base">{care.icon}</span>
              <div>
                <p className="font-semibold text-leaf-900">{care.label}</p>
                <p className={cx('font-semibold', dueDays <= 1 ? 'text-terra-600' : 'text-muted')}>
                  {dueDays <= 0 ? 'Hari ini!' : dueDays === 1 ? 'Besok' : `${dueDays} hari lagi`}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-xs text-muted">Tidak ada pengingat aktif</span>
          )}
          <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-leaf-700 shadow-sm">
            {plant.lastWatered ? formatDate(plant.lastWatered) : '—'} 💧
          </span>
        </div>
      </div>
    </Link>
  )
}