import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../utils/format'

const variants = {
  primary: 'bg-leaf-700 text-cream hover:bg-leaf-800 shadow-soft hover:shadow-lift dark:bg-leaf-600 dark:hover:bg-leaf-700',
  secondary: 'bg-white text-forest ring-1 ring-sage-200 hover:bg-sage-50 hover:ring-sage-300 shadow-soft dark:bg-sage-800 dark:text-white dark:ring-sage-600 dark:hover:bg-sage-700',
  outline: 'bg-transparent text-leaf-700 ring-1 ring-leaf-300 hover:bg-leaf-50 hover:ring-leaf-400 dark:text-leaf-400 dark:ring-leaf-600 dark:hover:bg-leaf-900/30',
  soft: 'bg-leaf-100 text-leaf-800 hover:bg-leaf-200 dark:bg-leaf-900/30 dark:text-leaf-300 dark:hover:bg-leaf-900/50',
  danger: 'bg-terra-600 text-white hover:bg-terra-700 shadow-soft',
  ghost: 'bg-transparent text-muted hover:bg-sage-50 hover:text-forest dark:text-sage-400 dark:hover:bg-sage-800 dark:hover:text-white',
  terra: 'bg-terra-500 text-white hover:bg-terra-600 shadow-soft',
  sun: 'bg-sun-200 text-forest hover:bg-sun-300 shadow-soft dark:bg-sun-800 dark:text-white dark:hover:bg-sun-700',
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
