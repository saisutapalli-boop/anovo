import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

export default function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex animate-fade-in items-center gap-2 rounded-xl bg-brand-teal px-5 py-3 text-sm font-bold text-white shadow-xl">
      <CheckCircle2 className="size-4 shrink-0" />
      {message}
    </div>
  )
}
