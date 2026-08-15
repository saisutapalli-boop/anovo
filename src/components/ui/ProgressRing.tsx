import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function ProgressRing({
  value,
  size = 120,
  thickness = 14,
  color = '#11a84e',
  trackColor = '#eaeded',
  children,
}: {
  value: number
  size?: number
  thickness?: number
  color?: string
  trackColor?: string
  children?: React.ReactNode
}) {
  const target = Math.max(0, Math.min(100, value))
  const [animated, setAnimated] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const duration = 800
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const t = Math.min(1, elapsed / duration)
      setAnimated(target * easeOutCubic(t))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target])

  const deg = animated * 3.6

  return (
    <div
      className="relative shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} ${deg}deg, ${trackColor} ${deg}deg)`,
      }}
    >
      <div
        className="absolute flex flex-col items-center justify-center rounded-full bg-white text-center"
        style={{ inset: thickness }}
      >
        {children}
      </div>
    </div>
  )
}
