export default function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-xl border border-[#e2e8f0] bg-white ${className}`}>{children}</div>
  )
}
