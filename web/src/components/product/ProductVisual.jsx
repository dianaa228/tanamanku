import { cx } from '../../utils/format'

/** Visual produk: natural gradient + emoji. */
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
      {/* Subtle bokeh orbs */}
      <span className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
      <span className="absolute -bottom-10 -right-6 h-36 w-36 rounded-full bg-black/5 blur-2xl" />
      <span className="absolute right-8 top-6 h-16 w-16 rounded-full bg-white/10 blur-xl" />
      {/* Overlay */}
      <span className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/8" />
      {/* Emoji */}
      <span
        className={cx(
          'relative select-none drop-shadow-md transition-transform duration-500 group-hover:scale-105',
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
