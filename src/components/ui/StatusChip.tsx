export default function StatusChip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`inline-flex w-fit items-start rounded-md border border-[#dddddd] bg-[#eaeded] px-2 py-1 ${className}`}
    >
      <p className="whitespace-nowrap text-[11px] tracking-[0.055px] text-brand-teal-dark">{children}</p>
    </div>
  )
}
