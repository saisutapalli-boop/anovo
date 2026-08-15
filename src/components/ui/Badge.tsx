export type BadgeTone = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand'

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: 'bg-[#11a84e]/10 text-[#0d8a40] border-[#11a84e]/25',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  error: 'bg-rose-100 text-rose-700 border-rose-200',
  info: 'bg-sky-100 text-sky-800 border-sky-200',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  brand: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
}

export default function Badge({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: React.ReactNode
  tone?: BadgeTone
  className?: string
}) {
  return (
    <span
      className={`inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
