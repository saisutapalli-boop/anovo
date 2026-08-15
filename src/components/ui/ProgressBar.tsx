import { useEffect, useState } from 'react'

export default function ProgressBar({
  value,
  max = 100,
  color = '#055979',
  trackColor = '#f5f5f5',
  className = '',
  height = 8,
}: {
  value: number
  max?: number
  color?: string
  trackColor?: string
  className?: string
  height?: number
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const [animatedPct, setAnimatedPct] = useState(0)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimatedPct(pct))
    return () => cancelAnimationFrame(frame)
  }, [pct])

  return (
    <div
      className={`w-full overflow-hidden rounded-full ${className}`}
      style={{ height, background: trackColor }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${animatedPct}%`, background: color }}
      />
    </div>
  )
}
