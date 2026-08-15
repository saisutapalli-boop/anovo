import { useEffect, useRef, useState } from 'react'

export interface DonutSegment {
  value: number
  color: string
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function Donut({
  segments,
  size = 110,
  thickness = 16,
  centerValue,
  centerLabel,
  activeIndex,
  onActiveIndexChange,
}: {
  segments: DonutSegment[]
  size?: number
  thickness?: number
  centerValue?: string
  centerLabel?: string
  /** Pass to control which segment is highlighted from outside (e.g. legend hover). */
  activeIndex?: number | null
  onActiveIndexChange?: (index: number | null) => void
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1
  const [progress, setProgress] = useState(0)
  const [internalHover, setInternalHover] = useState<number | null>(null)
  const rafRef = useRef<number | null>(null)

  const hovered = activeIndex !== undefined ? activeIndex : internalHover
  const setHovered = onActiveIndexChange ?? setInternalHover

  useEffect(() => {
    const duration = 900
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const t = Math.min(1, elapsed / duration)
      setProgress(easeOutCubic(t))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [total])

  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const sweepLen = progress * circumference

  let cursor = 0
  const arcs = segments.map((s, i) => {
    const startLen = Math.min((cursor / total) * circumference, sweepLen)
    cursor += s.value
    const endLen = Math.min((cursor / total) * circumference, sweepLen)
    const len = Math.max(0, endLen - startLen)
    return { color: s.color, i, dashArray: `${len} ${Math.max(circumference - len, 0)}`, dashOffset: -startLen }
  })

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 overflow-visible">
        {arcs.map((a) => (
          <circle
            key={a.i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={a.color}
            strokeWidth={hovered === a.i ? thickness + 4 : thickness}
            strokeDasharray={a.dashArray}
            strokeDashoffset={a.dashOffset}
            className="cursor-pointer transition-all duration-200"
            style={{ opacity: hovered === null || hovered === a.i ? 1 : 0.35 }}
            onMouseEnter={() => setHovered(a.i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-full">
        {centerValue && <p className="text-base leading-tight text-[#383838]">{centerValue}</p>}
        {centerLabel && <p className="text-[11px] leading-tight tracking-[0.055px] text-[#4d4e50]">{centerLabel}</p>}
      </div>
    </div>
  )
}
