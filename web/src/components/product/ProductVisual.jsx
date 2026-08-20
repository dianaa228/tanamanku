import { cx } from '../../utils/format'

/** Visual produk: gradient lembut + emoji besar — tanpa ketergantungan gambar eksternal. */
export default function ProductVisual({ emoji, gradient, className, emojiClassName, ...props }) {
  return (
    <div
      className={cx(
        'relative flex items-center justify-center overflow-hidden bg-gradient-to-br',
        gradient,
        className,
      )}
      {...props}
    >
      {/* Ornamen bokeh */}
      <span className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-white/15 blur-md" />
      <span className="absolute -bottom-8 -right-4 h-24 w-24 rounded-full bg-black/10 blur-md" />
      <span className={cx('relative select-none drop-shadow-md', emojiClassName)} role="img" aria-label={emoji}>
        {emoji}
      </span>
    </div>
  )
}
