import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusChip from './StatusChip'

export default function KpiCard({
  title,
  chip,
  metricValue,
  metricLabel,
  metricColor = '#055979',
  children,
  linkLabel,
  linkTo,
}: {
  title: string
  chip: string
  metricValue: string
  metricLabel: string
  metricColor?: string
  children: React.ReactNode
  linkLabel: string
  linkTo: string
}) {
  return (
    <div className="flex h-[273px] flex-1 flex-col gap-3 rounded-xl border border-[#dddddd] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-teal/30 hover:shadow-[0_8px_24px_rgba(0,89,115,0.08)]">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-2xl leading-8 tracking-[-0.12px] text-[#383838]">{title}</p>
          <StatusChip>{chip}</StatusChip>
        </div>
        <div className="flex flex-col items-end whitespace-nowrap">
          <p className="text-2xl leading-8 tracking-[-0.12px]" style={{ color: metricColor }}>
            {metricValue}
          </p>
          <p className="text-[11px] tracking-[0.055px] text-[#4d4e50]">{metricLabel}</p>
        </div>
      </div>
      <div className="flex flex-1 items-center gap-5">{children}</div>
      <Link to={linkTo} className="group flex items-center justify-center gap-1 rounded-md bg-[#fefefe] py-1 transition-colors hover:bg-brand-teal/5">
        <span className="text-sm text-brand-teal">{linkLabel}</span>
        <ArrowRight className="size-3.5 text-brand-teal transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}
