import { forwardRef, useId } from 'react'
import { cx } from '../../utils/format'

const Input = forwardRef(function Input(
  { label, error, hint, icon, type = 'text', className, wrapperClassName, ...props },
  ref,
) {
  const id = useId()
  return (
    <div className={cx('w-full', wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-leaf-900">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg opacity-60">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={cx(
            'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-leaf-950 shadow-sm transition-all',
            'placeholder:text-leaf-900/35 focus:outline-none focus:ring-2 focus:ring-offset-0',
            icon && 'pl-11',
            error
              ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
              : 'border-leaf-200 focus:border-leaf-400 focus:ring-leaf-200',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-leaf-900/50">{hint}</p>}
    </div>
  )
})

export default Input
