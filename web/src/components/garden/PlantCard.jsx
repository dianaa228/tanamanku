import { Link } from 'react-router-dom'
import { daysUntil, formatDate } from '../../utils/format'
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
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-leaf-100/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative">
        <ProductVisual
          emoji={plant.species.emoji}
          gradient={plant.photoGradient || plant.species.gradient}
          className="h-40 w-full transition-transform duration-500 group-hover:scale-[1.04]"
          emojiClassName="text-7xl"
        />
        <div className="absolute left-3 top-3">
          <PlantStatus status={plant.status} size="sm" />
        </div>
        <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-leaf-900 shadow-sm backdrop-blur">
          {plant.height} cm
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-leaf-950 group-hover:text-leaf-700">{plant.nickname}</h3>
            <p className="text-xs text-leaf-900/50">{plant.species.name}</p>
          </div>
          <span className="text-xs font-medium text-leaf-900/40">📍 {plant.location}</span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl bg-leaf-50 px-3 py-2.5">
          {nextReminder && care ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-base">{care.icon}</span>
              <div>
                <p className="font-semibold text-leaf-900">{care.label}</p>
                <p className={dueDays <= 1 ? 'font-bold text-rose-600' : 'text-leaf-900/50'}>
                  {dueDays <= 0 ? 'Hari ini!' : dueDays === 1 ? 'Besok' : `${dueDays} hari lagi`}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-xs text-leaf-900/50">Tidak ada pengingat aktif</span>
          )}
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-leaf-700 shadow-sm">
            {formatDate(plant.lastWatered)} 💧
          </span>
        </div>
      </div>
    </Link>
  )
}
