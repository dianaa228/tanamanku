import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../utils/format'

const variants = {
  primary: 'bg-[#345240] text-white hover:bg-[#2b4235] shadow-sm',
  secondary: 'bg-white text-[#1c2b22] ring-1 ring-[#c3d7c4] hover:bg-[#f5f2eb] shadow-sm',
  outline: 'bg-transparent text-[#345240] ring-1 ring-[#c3d7c4] hover:bg-[#e8f0e6]',
  soft: 'bg-[#e8f0e6] text-[#1c2b22] hover:bg-[#d4e4d1]',
  danger: 'bg-[#9c5238] text-white hover:bg-[#804230] shadow-sm',
  ghost: 'bg-transparent text-[#3f654c] hover:bg-[#e8f0e6] hover:text-[#1c2b22]',
  terra: 'bg-[#b56545] text-white hover:bg-[#9c5238] shadow-sm',
  sun: 'bg-[#d2a74e] text-[#1c2b22] hover:bg-[#c28d3a] shadow-sm font-bold',
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
