import { useEffect, useState } from 'react'

export default function AnimatedBar({
  size,
  axis = 'height',
  color,
  className = '',
  delay = 0,
  dimmed = false,
  onMouseEnter,
  onMouseLeave,
}: {
  size: number
  axis?: 'height' | 'width'
  color: string
  className?: string
  delay?: number
  dimmed?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setCurrent(size), delay)
    return () => clearTimeout(timer)
  }, [size, delay])

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${axis === 'height' ? 'transition-[height]' : 'transition-[width]'} cursor-pointer duration-700 ease-out ${dimmed ? 'opacity-35' : 'opacity-100'} ${className}`}
      style={{ [axis]: current, background: color, transitionProperty: `${axis}, opacity`, transitionDuration: '700ms, 200ms' }}
    />
  )
}
