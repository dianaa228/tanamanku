import { forwardRef, useId, useState } from 'react'
import { cx } from '../../utils/format'

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
)

const Input = forwardRef(function Input(
  { label, error, hint, icon, type = 'text', className, wrapperClassName, ...props },
  ref,
) {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className={cx('w-full', wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#1c2b22]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg opacity-60 text-[#68756c]">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          type={inputType}
          className={cx(
            'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[#1c2b22] shadow-sm transition-all',
            'placeholder:text-[#97a29a] focus:outline-none focus:ring-2 focus:ring-offset-0',
            icon && 'pl-11',
            isPassword && 'pr-11',
            error
              ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
              : 'border-[#c3d7c4] focus:border-[#3f654c] focus:ring-[#c3d7c4]/50',
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#68756c] transition hover:bg-[#e8f0e6] hover:text-[#1c2b22]"
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            <EyeIcon open={showPassword} />
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-[#dc2626]">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-[#68756c]">{hint}</p>}
    </div>
  )
})

export default Input
