import { cx } from '../../utils/format'

export default function Loading({ label = 'Memuat data...', className }) {
  return (
    <div className={cx('flex flex-col items-center justify-center gap-3 py-16 text-leaf-700 dark:text-leaf-400', className)}>
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-leaf-200 border-t-leaf-600 dark:border-sage-600 dark:border-t-leaf-400" />
        <span className="absolute inset-0 flex items-center justify-center text-lg">🌿</span>
      </div>
      <p className="text-sm font-medium text-leaf-900/60 dark:text-sage-400">{label}</p>
    </div>
  )
}
