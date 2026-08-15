import { useState } from 'react'
import Donut from './Donut'
import LegendRow from './LegendRow'

interface DonutLegendItem {
  value: number
  color: string
  label: string
  valueLabel?: string
}

export default function DonutLegend({
  items,
  size = 110,
  thickness = 18,
  centerValue,
  centerLabel,
}: {
  items: DonutLegendItem[]
  size?: number
  thickness?: number
  centerValue: string
  centerLabel: string
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex w-full items-center gap-5">
      <Donut
        size={size}
        thickness={thickness}
        segments={items}
        centerValue={centerValue}
        centerLabel={centerLabel}
        activeIndex={hovered}
        onActiveIndexChange={setHovered}
      />
      <div className="flex flex-1 flex-col gap-1.5">
        {items.map((item, i) => (
          <LegendRow
            key={item.label}
            color={item.color}
            label={item.label}
            value={item.valueLabel ?? String(item.value)}
            dimmed={hovered !== null && hovered !== i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </div>
    </div>
  )
}
