import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../utils/format'

const variants = {
  primary: 'bg-leaf-600 text-white hover:bg-leaf-700 shadow-soft hover:shadow-lift',
  secondary: 'bg-white text-leaf-800 ring-1 ring-leaf-200 hover:bg-leaf-50',
  outline: 'bg-transparent text-leaf-700 ring-1 ring-leaf-300 hover:bg-leaf-50',
  soft: 'bg-leaf-100 text-leaf-800 hover:bg-leaf-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  ghost: 'bg-transparent text-leaf-700 hover:bg-leaf-50',
  soil: 'bg-soil-600 text-white hover:bg-soil-700',
  sun: 'bg-sun-400 text-soil-950 hover:bg-sun-300',
}

const sizes = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
  icon: 'p-2.5 text-base',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className, loading = false, to, children, ...props },
  ref,
) {
  const classes = cx(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf-400 focus-visible:ring-offset-2',
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
