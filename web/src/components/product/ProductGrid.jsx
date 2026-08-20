import ProductCard from './ProductCard'
import EmptyState from '../ui/EmptyState'

export default function ProductGrid({ products, compact = false, emptyProps }) {
  if (!products.length) {
    return (
      <EmptyState
        icon="🔍"
        title="Tidak ada produk ditemukan"
        description={emptyProps?.description || 'Coba ubah kata kunci atau filter pencarian Anda.'}
        actionLabel="Bersihkan filter"
        onAction={emptyProps?.onReset}
      />
    )
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} compact={compact} />
      ))}
    </div>
  )
}
