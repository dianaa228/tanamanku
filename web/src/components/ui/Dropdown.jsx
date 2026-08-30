import { useEffect, useRef, useState } from 'react'
import { cx } from '../../utils/format'

export default function Dropdown({ trigger, children, align = 'right', className }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((o) => !o)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen((o) => !o) }} className="cursor-pointer" aria-expanded={open}>
        {trigger}
      </div>
      {open && (
        <div
          className={cx(
            'absolute z-30 mt-2 min-w-[10rem] animate-pop rounded-2xl border border-leaf-100 bg-white p-1.5 shadow-lift',
            align === 'right' ? 'right-0' : 'left-0',
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export const DropdownItem = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={cx(
      'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-leaf-900 transition hover:bg-leaf-50',
      className,
    )}
  >
    {children}
  </button>
)
