import { useState } from 'react'
import AnimatedBar from './AnimatedBar'
import LegendRow from './LegendRow'

interface Bar {
  size: number
  color: string
  label: string
  value: string
}

export default function BarLegend({
  bars,
  axis = 'height',
  containerClassName,
  barClassName,
  showValues = false,
}: {
  bars: Bar[]
  axis?: 'height' | 'width'
  containerClassName: string
  barClassName: string
  showValues?: boolean
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex w-full items-center gap-5">
      <div className={containerClassName}>
        {bars.map((b, i) => (
          <div
            key={b.label}
            className={axis === 'height' ? 'flex flex-col items-center gap-1.5' : 'contents'}
          >
            {showValues && axis === 'height' && <span className="text-xs text-[#383838]">{b.value}</span>}
            <AnimatedBar
              size={b.size}
              axis={axis}
              color={b.color}
              delay={i * 70}
              dimmed={hovered !== null && hovered !== i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={barClassName}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        {bars.map((b, i) => (
          <LegendRow
            key={b.label}
            color={b.color}
            label={b.label}
            value={b.value}
            dimmed={hovered !== null && hovered !== i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </div>
    </div>
  )
}
