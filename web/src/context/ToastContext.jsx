import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { cx } from '../utils/format'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = ++idRef.current
      setToasts((t) => [...t, { id, message, type }])
      setTimeout(() => dismiss(id), 3500)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <button
            key={toast.id}
            onClick={() => dismiss(toast.id)}
            className={cx(
              'animate-pop pointer-events-auto flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white shadow-lift',
              toast.type === 'success' && 'bg-leaf-700',
              toast.type === 'error' && 'bg-rose-600',
              toast.type === 'info' && 'bg-soil-600',
            )}
          >
            <span className="text-lg">{toast.type === 'success' ? '✅' : toast.type === 'error' ? '⚠️' : '💡'}</span>
            <span className="flex-1">{toast.message}</span>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast harus dipakai di dalam <ToastProvider>')
  return ctx
}
