import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
  label: string
  href?: string
}

export default function Breadcrumb({ trail, title }: { trail: Crumb[]; title: string }) {
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs text-[#788a95]">
        {trail.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {c.href ? (
              <Link to={c.href} className="font-medium transition hover:text-brand-teal">
                {c.label}
              </Link>
            ) : (
              <span className="font-medium">{c.label}</span>
            )}
            {i < trail.length - 1 && <ChevronRight className="size-3 text-[#cad2d3]" />}
          </span>
        ))}
      </div>
      <h1 className="text-2xl tracking-[-0.12px] text-[#383838]">{title}</h1>
    </div>
  )
}
