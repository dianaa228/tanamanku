import { Link } from 'react-router-dom'
import { formatRupiah, cx } from '../../utils/format'
import { CARE_LEVEL } from '../../types/constants'
import ProductVisual from './ProductVisual'
import Rating from '../ui/Rating'

export default function ProductCard({ product, compact = false }) {
  const care = CARE_LEVEL[product.careLevel]
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-sage-100 bg-warm-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-leaf-200 hover:shadow-card"
    >
      <div className="relative m-2 overflow-hidden rounded-2xl">
        <ProductVisual
          emoji={product.emoji}
          gradient={product.gradient}
          className={cx('w-full transition-transform duration-500 group-hover:scale-[1.05]', compact ? 'h-40' : 'h-52')}
          emojiClassName={compact ? 'text-5xl' : 'text-7xl'}
        />
        {product.originalPrice && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-terra-500 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-soft">
            {Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        {care && (
          <span className={cx('absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-md', care.chip)}>
            {care.icon} {care.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4 pt-1">
        <p className="text-[11px] font-medium tracking-wide text-muted">{product.storeName}</p>
        <h3 className={cx('font-bold leading-snug text-forest transition group-hover:text-leaf-700', compact ? 'text-[15px]' : 'text-base')}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <Rating value={product.rating} showValue />
          <span className="text-[11px] text-muted">· {product.sold}+ terjual</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {product.originalPrice && (
              <p className="text-[11px] text-muted-light line-through">{formatRupiah(product.originalPrice)}</p>
            )}
            <p className="text-base font-extrabold text-leaf-700">{formatRupiah(product.price)}</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-100 text-leaf-700 transition-all duration-300 group-hover:bg-leaf-700 group-hover:text-cream group-hover:shadow-soft">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
