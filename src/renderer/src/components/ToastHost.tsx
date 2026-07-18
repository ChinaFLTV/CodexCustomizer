import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { IconAlert, IconCheck, IconInfo } from './Icons'

export function ToastHost() {
  const toasts = useAppStore((s) => s.toasts)
  const dismiss = useAppStore((s) => s.dismissToast)

  return (
    <div className="toast-host">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDone={() => dismiss(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({
  toast,
  onDone
}: {
  toast: { id: string; type: string; message: string }
  onDone: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [onDone])

  const Icon = toast.type === 'error' ? IconAlert : toast.type === 'success' ? IconCheck : IconInfo

  return (
    <motion.div
      className={`toast ${toast.type}`}
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      onClick={onDone}
      role="status"
    >
      <Icon className="toast-icon" />
      <span>{toast.message}</span>
    </motion.div>
  )
}
