import { useState } from 'react'
import { cx } from '../../utils/format'
import ProductVisual from './ProductVisual'

export default function ProductGallery({ product }) {
  // Demo: tampilan visual sama dengan gradasi berbeda untuk "galeri"
  const views = [
    { emoji: product.emoji, gradient: product.gradient, label: 'Tampak depan' },
    { emoji: product.emoji, gradient: 'from-leaf-300 to-leaf-600', label: 'Tampak samping' },
    { emoji: '🌱', gradient: 'from-lime-200 to-green-500', label: 'Bibit muda' },
  ]
  const [active, setActive] = useState(0)

  return (
    <div>
      <ProductVisual
        emoji={views[active].emoji}
        gradient={views[active].gradient}
        className="aspect-square w-full rounded-3xl"
        emojiClassName="text-9xl"
      />
      <div className="mt-4 flex gap-3">
        {views.map((v, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cx(
              'overflow-hidden rounded-2xl border-2 transition-all',
              active === i ? 'border-leaf-600 shadow-soft' : 'border-transparent opacity-60 hover:opacity-100',
            )}
          >
            <ProductVisual emoji={v.emoji} gradient={v.gradient} className="h-20 w-20" emojiClassName="text-3xl" />
          </button>
        ))}
      </div>
    </div>
  )
}
