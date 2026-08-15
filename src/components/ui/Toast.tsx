import { useEffect } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'

export type ToastTone = 'success' | 'warning' | 'error' | 'neutral'

const TONE_STYLES: Record<ToastTone, { bg: string; icon: typeof CheckCircle2 }> = {
  success: { bg: 'bg-[#11a84e]', icon: CheckCircle2 },
  warning: { bg: 'bg-[#e67e22]', icon: AlertTriangle },
  error: { bg: 'bg-rose-600', icon: XCircle },
  neutral: { bg: 'bg-[#383838]', icon: Info },
}

export default function Toast({
  message,
  tone = 'neutral',
  onDone,
}: {
  message: string
  tone?: ToastTone
  onDone: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800)
    return () => clearTimeout(timer)
  }, [onDone])

  const { bg, icon: Icon } = TONE_STYLES[tone]

  return (
    <div className={`fixed right-6 top-6 z-[100] flex animate-fade-in items-center gap-2 rounded-xl ${bg} px-5 py-3 text-sm font-bold text-white shadow-xl`}>
      <Icon className="size-4 shrink-0" />
      {message}
    </div>
  )
}
