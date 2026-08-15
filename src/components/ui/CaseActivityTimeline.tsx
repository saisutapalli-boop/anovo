import { Check, History } from 'lucide-react'

export interface TimelineEvent {
  title: string
  meta: string
  marker: 'check' | 'dot'
  tone?: 'default' | 'success'
}

export default function CaseActivityTimeline({
  title,
  subtitle,
  badge,
  events,
  dividerLabel,
  dividerIndex,
}: {
  title: string
  subtitle: string
  badge?: React.ReactNode
  events: TimelineEvent[]
  dividerLabel?: string
  dividerIndex?: number
}) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-[#dddddd] bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-teal">
            <History className="size-3.5" />
            {title}
          </p>
          <p className="mt-1 text-sm text-[#666666]">{subtitle}</p>
        </div>
        {badge}
      </div>

      <div className="flex flex-col">
        {events.map((event, i) => (
          <div key={i}>
            {dividerIndex === i && dividerLabel && (
              <div className="mb-4 mt-1 flex items-center gap-2 pl-7">
                <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-[#788a95]">
                  {dividerLabel}
                </span>
                <div className="h-px flex-1 bg-[#f0f0f0]" />
              </div>
            )}
            <div className="flex animate-fade-in gap-3">
              <div className="flex flex-col items-center">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#11a84e] text-white">
                  {event.marker === 'check' ? <Check className="size-3" /> : <span className="size-1.5 rounded-full bg-white" />}
                </span>
                {i < events.length - 1 && <div className="my-0.5 w-px flex-1 bg-[#e5e5e5]" />}
              </div>
              <div className="pb-5">
                <p className={`text-sm font-bold ${event.tone === 'success' ? 'text-[#0d8a40]' : 'text-[#383838]'}`}>{event.title}</p>
                <p className="text-xs text-[#788a95]">{event.meta}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
