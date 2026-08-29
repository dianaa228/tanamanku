import { cx } from '../../utils/format'

/** Visual produk: premium gradient + emoji — no external images needed. */
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
      {/* Premium bokeh orbs */}
      <span className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
      <span className="absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-black/8 blur-2xl" />
      <span className="absolute right-10 top-8 h-20 w-20 rounded-full bg-white/15 blur-xl" />
      <span className="absolute bottom-8 left-12 h-16 w-16 rounded-full bg-white/10 blur-lg" />
      {/* Subtle overlay gradient */}
      <span className="absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-white/12" />
      {/* Emoji with shadow */}
      <span
        className={cx(
          'relative select-none drop-shadow-xl transition-transform duration-500 group-hover:scale-110',
          emojiClassName,
        )}
        role="img"
        aria-label={emoji}
      >
        {emoji}
      </span>
    </div>
  )
}
