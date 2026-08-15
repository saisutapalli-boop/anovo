import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary'

// Matches the Figma "table-actions" component (node 183:3520): a pill-shaped
// row-level action button used inside data tables.
const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-brand-teal text-white hover:bg-brand-teal-hover',
  secondary: 'bg-white text-[#383838] border border-[#cad2d3] hover:bg-[#f5f5f5]',
}

export default function TableActionButton({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
