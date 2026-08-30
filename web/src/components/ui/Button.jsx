import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../utils/format'

const variants = {
  primary: 'bg-leaf-700 text-white hover:bg-leaf-800 shadow-soft hover:shadow-lift',
  secondary: 'bg-[var(--bg-card)] text-[var(--text-primary)] ring-1 ring-[var(--border-primary)] hover:bg-[var(--bg-card-hover)] shadow-soft backdrop-blur-sm',
  outline: 'bg-transparent text-leaf-300 ring-1 ring-leaf-400/50 hover:bg-leaf-800/30 hover:ring-leaf-300',
  soft: 'bg-leaf-800/30 text-leaf-200 hover:bg-leaf-800/50',
  danger: 'bg-terra-600 text-white hover:bg-terra-700 shadow-soft',
  ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)]',
  terra: 'bg-terra-500 text-white hover:bg-terra-600 shadow-soft',
  sun: 'bg-sun-400 text-forest hover:bg-sun-500 shadow-soft font-bold',
}

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-[15px] rounded-2xl',
  icon: 'p-2.5 text-base rounded-xl',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className, loading = false, to, children, ...props },
  ref,
) {
  const classes = cx(
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf-400 focus-visible:ring-offset-2',
    variants[variant],
    sizes[size],
    className,
  )

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
})

export default Button
