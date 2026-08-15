import { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div
      className={
        'flex items-center gap-2 rounded-lg border bg-white px-4 py-2 transition-all duration-200 ' +
        (focused ? 'border-brand-teal shadow-[0_0_0_3px_rgba(0,89,115,0.12)]' : 'border-[#dddddd] hover:border-brand-teal/40') +
        ' ' +
        className
      }
    >
      <Search className={'size-3.5 shrink-0 transition-colors ' + (focused ? 'text-brand-teal' : 'text-[#788a95]')} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full text-sm text-[#383838] outline-none placeholder:text-[#788a95]"
      />
    </div>
  )
}
