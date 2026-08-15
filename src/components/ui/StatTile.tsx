export default function StatTile({
  label,
  value,
  note,
  color = '#055979',
  onClick,
}: {
  label: string
  value: string
  note: string
  color?: string
  onClick?: () => void
}) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      className={`flex min-h-[116px] w-full flex-col justify-between rounded-xl border border-[#dddddd] bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-teal/30 hover:shadow-[0_8px_24px_rgba(0,89,115,0.08)] ${onClick ? 'cursor-pointer' : ''}`}
    >
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#666666]">{label}</p>
      <p className="mt-2 text-3xl font-black leading-none" style={{ color }}>
        {value}
      </p>
      <p className="mt-2 text-[11px] text-[#788a95]">{note}</p>
    </Comp>
  )
}
