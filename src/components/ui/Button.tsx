import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

// Primary/Secondary match the Figma "page-buttons" component (node 164:2944).
const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-brand-teal text-white hover:bg-brand-teal-hover',
  secondary: 'bg-[#fefefe] text-[#4d4e50] border border-[#383838] hover:bg-[#f5f5f5]',
  ghost: 'bg-transparent text-brand-teal hover:bg-brand-teal/5',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={`inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md font-bold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
