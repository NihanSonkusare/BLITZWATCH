'use client'

import { useEffect, useState } from 'react'
import { X, WifiOff, CheckCircle, AlertCircle, Info } from 'lucide-react'

export type ToastType = 'error' | 'success' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

// Global toast state (simple pub/sub)
const listeners: Array<(toasts: Toast[]) => void> = []
let currentToasts: Toast[] = []

export function toast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).slice(2)
  currentToasts = [...currentToasts, { id, message, type }]
  listeners.forEach((l) => l(currentToasts))

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    dismissToast(id)
  }, 5000)
}

function dismissToast(id: string) {
  currentToasts = currentToasts.filter((t) => t.id !== id)
  listeners.forEach((l) => l(currentToasts))
}

const ICONS = { error: AlertCircle, success: CheckCircle, info: Info, warning: WifiOff }
const COLORS = {
  error: 'bg-[#FF4747]/10 border-[#FF4747]/30 text-[#FF4747]',
  success: 'bg-[#47FF9E]/10 border-[#47FF9E]/30 text-[#47FF9E]',
  info: 'bg-[#E8FF47]/10 border-[#E8FF47]/30 text-[#E8FF47]',
  warning: 'bg-[#FFB347]/10 border-[#FFB347]/30 text-[#FFB347]',
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    listeners.push(setToasts)
    return () => {
      const idx = listeners.indexOf(setToasts)
      if (idx > -1) listeners.splice(idx, 1)
    }
  }, [])

  return (
    <div id="toast-container" className="fixed top-4 left-1/2 -translate-x-1/2 z-[9998] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const Icon = ICONS[t.type]
        return (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-btn border backdrop-blur-xl shadow-lg pointer-events-auto animate-in slide-in-from-top-2 duration-200 ${COLORS[t.type]}`}
            style={{ minWidth: '280px', maxWidth: '480px' }}
          >
            <Icon size={14} className="flex-shrink-0" />
            <p className="text-xs flex-1">{t.message}</p>
            <button
              onClick={() => dismissToast(t.id)}
              className="opacity-60 hover:opacity-100 transition-opacity ml-2"
            >
              <X size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
