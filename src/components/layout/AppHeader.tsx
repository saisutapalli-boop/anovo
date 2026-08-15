import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Sparkles, HelpCircle } from 'lucide-react'
import NotificationBell from './NotificationBell'

export default function AppHeader() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="flex w-full items-center justify-between gap-4 bg-[#fefefe] px-4 py-3 wide:px-20">
      <Link to="/dashboard" className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80" aria-label="Go to Dashboard">
        <img src="/logo.png" alt="AnovoRx" className="h-8 w-auto object-contain" />
        <div className="hidden h-6 w-px bg-[#dddddd] wide:block" />
        <p className="hidden whitespace-nowrap text-sm text-[#383838] wide:block">SPECIALTY RX HUB PLATFORM</p>
      </Link>

      <div
        className={
          'hidden max-w-md flex-1 items-center gap-2 rounded-lg border bg-white px-4 py-3 transition-all duration-200 wide:flex ' +
          (searchFocused ? 'border-brand-teal shadow-[0_0_0_3px_rgba(0,89,115,0.12)]' : 'border-[#dddddd] hover:border-brand-teal/40')
        }
      >
        <Search className={'size-4 shrink-0 transition-colors ' + (searchFocused ? 'text-brand-teal' : 'text-[#788a95]')} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Ask AI Assistant or search orders, NPIs, cases..."
          className="flex-1 truncate bg-transparent text-sm text-[#383838] outline-none placeholder:text-[#383838]/60"
        />
        <Sparkles className="size-4 shrink-0 animate-pulse text-brand-green" />
      </div>

      <div className="flex shrink-0 items-center gap-3 md:gap-6">
        <Link
          to="/help"
          className="rounded-lg p-1.5 text-[#383838]/70 transition-colors duration-200 hover:bg-[#f5f5f5] hover:text-[#383838]"
          aria-label="Help"
        >
          <HelpCircle className="size-5" />
        </Link>
        <NotificationBell />
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="flex shrink-0 cursor-pointer items-center gap-3 rounded-full border border-[#dddddd] bg-[#fefefe] px-3 py-2 transition-colors duration-200 hover:border-brand-teal/30 hover:bg-[#f5f5f5]"
          aria-label="Account settings"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-teal">
            <span className="text-base text-white">AM</span>
          </div>
          <div className="hidden flex-col whitespace-nowrap text-left text-[#383838] wide:flex">
            <span className="text-sm leading-tight">Alex Morgan</span>
            <span className="text-[11px] leading-tight tracking-[0.055px]">Super Admin</span>
          </div>
        </button>
      </div>
    </header>
  )
}
