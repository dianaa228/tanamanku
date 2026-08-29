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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sage-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative overflow-hidden">
        <ProductVisual
          emoji={product.emoji}
          gradient={product.gradient}
          className={cx('w-full transition-transform duration-500 group-hover:scale-[1.04]', compact ? 'h-36' : 'h-48')}
          emojiClassName={compact ? 'text-5xl' : 'text-7xl'}
        />
        {product.originalPrice && (
          <span className="absolute left-2.5 top-2.5 rounded-lg bg-terra-500 px-2 py-1 text-[11px] font-extrabold text-white shadow-soft">
            {Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        {care && (
          <span className={cx('absolute right-2.5 top-2.5 rounded-lg px-2 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-md', care.chip)}>
            {care.icon} {care.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3.5 sm:p-4">
        <p className="text-[11px] font-medium text-muted">{product.storeName}</p>
        <h3 className={cx('font-bold leading-snug text-forest transition group-hover:text-leaf-700', compact ? 'text-sm' : 'text-[15px]')}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <Rating value={product.rating} showValue />
          <span className="text-[11px] text-muted">· {product.sold}+ terjual</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-1.5">
          <div>
            {product.originalPrice && (
              <p className="text-[11px] text-muted-light line-through">{formatRupiah(product.originalPrice)}</p>
            )}
            <p className="text-sm font-extrabold text-leaf-700">{formatRupiah(product.price)}</p>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-leaf-100 text-leaf-600 transition-all duration-300 group-hover:bg-leaf-600 group-hover:text-white group-hover:shadow-soft">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
