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
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-leaf-100/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative">
        <ProductVisual
          emoji={product.emoji}
          gradient={product.gradient}
          className={cx('w-full transition-transform duration-500 group-hover:scale-[1.03]', compact ? 'h-36' : 'h-48')}
          emojiClassName={compact ? 'text-5xl' : 'text-7xl'}
        />
        {product.originalPrice && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-extrabold text-white shadow-soft">
            {Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        {care && (
          <span className={cx('absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur', care.chip)}>
            {care.icon} {care.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium text-leaf-900/50">{product.storeName}</p>
        <h3 className={cx('font-bold leading-snug text-leaf-950 transition group-hover:text-leaf-700', compact ? 'text-sm' : 'text-[15px]')}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <Rating value={product.rating} showValue />
          <span className="text-xs text-leaf-900/40">· {product.sold}+ terjual</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {product.originalPrice && (
              <p className="text-xs text-leaf-900/40 line-through">{formatRupiah(product.originalPrice)}</p>
            )}
            <p className="text-base font-extrabold text-leaf-700">{formatRupiah(product.price)}</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-100 text-leaf-700 transition-all duration-300 group-hover:bg-leaf-600 group-hover:text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
