import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export default function FilterDropdown({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#dddddd] bg-white px-3 py-2 text-sm text-[#383838] transition-colors duration-200 hover:border-brand-teal/40 hover:bg-[#f5f5f5]"
      >
        {value}
        <ChevronDown className={`size-2.5 text-[#788a95] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-2 w-48 animate-fade-in rounded-lg border border-[#e5e5e5] bg-white p-1.5 shadow-lg">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-xs font-semibold text-[#383838] transition-colors hover:bg-[#f5f5f5]"
              >
                {option}
                {option === value && <Check className="size-3.5 text-brand-green" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
