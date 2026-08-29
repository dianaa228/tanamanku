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
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-leaf-100/60 bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-elevated hover:border-leaf-200/80"
    >
      <div className="relative overflow-hidden">
        <ProductVisual
          emoji={product.emoji}
          gradient={product.gradient}
          className={cx('w-full transition-transform duration-500 group-hover:scale-[1.05]', compact ? 'h-40' : 'h-52')}
          emojiClassName={compact ? 'text-6xl' : 'text-8xl'}
        />
        {product.originalPrice && (
          <span className="absolute left-3 top-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 px-2.5 py-1 text-xs font-extrabold text-white shadow-md shadow-rose-500/30">
            {Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        {care && (
          <span className={cx('absolute right-3 top-3 rounded-xl px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md', care.chip)}>
            {care.icon} {care.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium text-leaf-500">{product.storeName}</p>
        <h3 className={cx('font-bold leading-snug text-leaf-950 transition group-hover:text-leaf-700', compact ? 'text-sm' : 'text-[15px]')}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <Rating value={product.rating} showValue />
          <span className="text-xs text-leaf-500">· {product.sold}+ terjual</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {product.originalPrice && (
              <p className="text-xs text-leaf-400 line-through">{formatRupiah(product.originalPrice)}</p>
            )}
            <p className="text-base font-extrabold text-leaf-700">{formatRupiah(product.price)}</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-100 text-leaf-600 transition-all duration-300 group-hover:bg-leaf-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-leaf-600/25">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
