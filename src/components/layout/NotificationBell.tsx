import { useState } from 'react'
import { Bell, AlertTriangle, CheckCircle2, Info } from 'lucide-react'

interface Notification {
  id: string
  icon: typeof AlertTriangle
  tone: 'warning' | 'success' | 'info'
  title: string
  detail: string
  time: string
}

const NOTIFICATIONS: Notification[] = [
  { id: '1', icon: AlertTriangle, tone: 'warning', title: 'OCR review needed', detail: 'Sarah Mitchell · Diagnosis Code & NPI flagged', time: '8m ago' },
  { id: '2', icon: AlertTriangle, tone: 'warning', title: 'Cold-chain excursion alert', detail: 'Marcus Chen shipment out of 2-8°C range', time: '22m ago' },
  { id: '3', icon: Info, tone: 'info', title: 'Insurance card missing', detail: 'Sarah Mitchell · document gap on referral', time: '2h ago' },
  { id: '4', icon: CheckCircle2, tone: 'success', title: 'PA approved', detail: 'Sonia Patel · Altirel Sprinkle', time: '3h ago' },
  { id: '5', icon: Info, tone: 'info', title: 'Pharmacist verification pending', detail: '153 cases awaiting RPh action', time: '4h ago' },
  { id: '6', icon: CheckCircle2, tone: 'success', title: 'Report generated', detail: 'Referral Intake Summary · Last 30 Days', time: 'Yesterday' },
]

const TONE_CLASSES = {
  warning: 'bg-amber-100 text-amber-600',
  success: 'bg-[#11a84e]/10 text-[#11a84e]',
  info: 'bg-brand-teal/10 text-brand-teal',
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-1.5 text-[#383838]/70 transition-colors duration-200 hover:bg-[#f5f5f5] hover:text-[#383838]"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
        {NOTIFICATIONS.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
            {NOTIFICATIONS.length}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[85vw] animate-fade-in rounded-xl border border-[#e5e5e5] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#f0f0f0] px-4 py-3">
              <p className="text-sm font-bold text-[#383838]">Notifications</p>
              <span className="rounded-full bg-brand-teal/10 px-2 py-0.5 text-[10px] font-bold text-brand-teal">
                {NOTIFICATIONS.length} new
              </span>
            </div>
            <div className="flex max-h-96 flex-col divide-y divide-[#f0f0f0] overflow-y-auto">
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[#f9fafb]">
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${TONE_CLASSES[n.tone]}`}>
                    <n.icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#383838]">{n.title}</p>
                    <p className="truncate text-xs text-[#666666]">{n.detail}</p>
                    <p className="mt-0.5 text-[10px] text-[#788a95]">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
