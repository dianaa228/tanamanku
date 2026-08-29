import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../utils/format'

const variants = {
  primary: 'bg-gradient-to-r from-leaf-600 to-leaf-500 text-white hover:from-leaf-700 hover:to-leaf-600 shadow-lg shadow-leaf-600/25 hover:shadow-xl hover:shadow-leaf-600/30',
  secondary: 'bg-white text-leaf-800 ring-1 ring-leaf-200/80 hover:bg-leaf-50 hover:ring-leaf-300 shadow-sm hover:shadow-md',
  outline: 'bg-transparent text-leaf-700 ring-1 ring-leaf-300 hover:bg-leaf-50 hover:ring-leaf-400',
  soft: 'bg-leaf-100 text-leaf-800 hover:bg-leaf-200 shadow-sm',
  danger: 'bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:from-rose-700 hover:to-rose-600 shadow-lg shadow-rose-600/25',
  ghost: 'bg-transparent text-leaf-700 hover:bg-leaf-100 hover:text-leaf-800',
  soil: 'bg-gradient-to-r from-soil-600 to-soil-500 text-white hover:from-soil-700 hover:to-soil-600 shadow-lg shadow-soil-600/25',
  sun: 'bg-gradient-to-r from-sun-400 to-sun-500 text-soil-950 hover:from-sun-300 hover:to-sun-400 shadow-lg shadow-sun-400/30',
}

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-2xl',
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
