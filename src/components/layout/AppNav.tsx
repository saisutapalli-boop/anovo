import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ComponentType } from 'react'
import {
  LayoutDashboard,
  FilePlus,
  ShieldCheck,
  Package,
  ClipboardList,
  FileText,
  MessageCircle,
  User,
  Menu,
  X,
} from 'lucide-react'

export type NavKey =
  | 'dashboard'
  | 'referral-intake'
  | 'prior-authorization'
  | 'dispensing'
  | 'clinical'
  | 'audit'
  | 'consultations'
  | 'users'
  | 'settings'

interface NavItem {
  key: NavKey
  label: string
  icon: ComponentType<{ className?: string }>
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { key: 'referral-intake', label: 'Referral Intakes', icon: FilePlus, href: '/referral-intake' },
  { key: 'prior-authorization', label: 'Prior Authorization', icon: ShieldCheck, href: '/prior-authorization' },
  { key: 'dispensing', label: 'Dispensing Hub', icon: Package, href: '/dispensing' },
  { key: 'clinical', label: 'Clinical Assessments', icon: ClipboardList, href: '/clinical-assessments' },
  { key: 'audit', label: 'Audit & Reports', icon: FileText, href: '/audit-reports' },
  { key: 'consultations', label: 'Consultations', icon: MessageCircle, href: '/consultations' },
  { key: 'users', label: 'User Management', icon: User, href: '/user-management' },
]

const NAV_GRADIENT = { background: 'linear-gradient(90deg, #012e3f 0%, #055979 100%)' }

export default function AppNav({ active }: { active: NavKey }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const activeItem = NAV_ITEMS.find((i) => i.key === active)

  return (
    <>
      {/* Desktop tab bar (>= 1080px) */}
      <nav className="hidden w-full items-start gap-1 overflow-x-auto px-4 py-4 wide:flex wide:px-20" style={NAV_GRADIENT}>
        {NAV_ITEMS.map(({ key, label, icon: Icon, href }) => {
          const isActive = key === active
          return (
            <Link key={key} to={href}>
              <span
                className={
                  'flex shrink-0 items-center gap-1 rounded-lg p-2 text-sm transition-all duration-200 ' +
                  (isActive ? 'bg-[#eaeded] text-brand-teal' : 'text-white/90 hover:bg-white/10 hover:text-white')
                }
              >
                <Icon className="size-[18px]" />
                <span className="whitespace-nowrap">{label}</span>
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Mobile / tablet trigger bar (< 1080px) */}
      <div className="flex w-full items-center justify-between px-4 py-3 wide:hidden" style={NAV_GRADIENT}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          <Menu className="size-5" />
          Menu
        </button>
        {activeItem && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
            <activeItem.icon className="size-4" />
            {activeItem.label}
          </span>
        )}
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex wide:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="relative flex h-full w-72 max-w-[80vw] animate-slide-in-left flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#e5e5e5] px-4 py-4">
              <Link to="/dashboard" onClick={() => setOpen(false)} aria-label="Go to Dashboard">
                <img src="/logo.png" alt="AnovoRx" className="h-7 w-auto object-contain" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-[#788a95] transition-colors hover:text-[#383838]"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {NAV_ITEMS.map(({ key, label, icon: Icon, href }) => {
                const isActive = key === active
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setOpen(false)
                      navigate(href)
                    }}
                    className={
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ' +
                      (isActive ? 'bg-brand-teal/10 text-brand-teal' : 'text-[#4d4e50] hover:bg-[#f5f5f5]')
                    }
                  >
                    <Icon className="size-[18px] shrink-0" />
                    {label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
