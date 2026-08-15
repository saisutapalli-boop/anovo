export default function LegendRow({
  color,
  label,
  value,
  dimmed = false,
  onMouseEnter,
  onMouseLeave,
}: {
  color: string
  label: string
  value: string
  dimmed?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 transition-all duration-200 hover:bg-[#f5f5f5] ${dimmed ? 'opacity-35' : 'opacity-100'}`}
    >
      <span className="size-2.5 shrink-0 rounded-full" style={{ background: color }} />
      <span className="flex-1 text-sm text-[#4d4e50]">{label}</span>
      <span className="whitespace-nowrap text-sm text-[#383838]">{value}</span>
    </div>
  )
}
