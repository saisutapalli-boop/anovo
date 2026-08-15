import { useCallback, useState } from 'react'
import type { ToastTone } from '@/components/ui/Toast'

export function useToast() {
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null)

  const showToast = useCallback((message: string, tone: ToastTone = 'neutral') => {
    setToast({ message, tone })
  }, [])

  const clearToast = useCallback(() => setToast(null), [])

  return { toast, showToast, clearToast }
}
