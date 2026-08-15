import AppHeader from './AppHeader'
import AppNav, { type NavKey } from './AppNav'
import AppFooter from './AppFooter'

export default function AppShell({
  active,
  showNav = true,
  children,
}: {
  active: NavKey
  showNav?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#f1f4f6]">
      <div className="z-40 shrink-0">
        <AppHeader />
        {showNav && <AppNav active={active} />}
      </div>
      <main className="flex w-full flex-1 flex-col overflow-y-auto px-4 py-6 wide:px-20 wide:py-8">
        {children}
      </main>
      <div className="z-40 shrink-0">
        <AppFooter />
      </div>
    </div>
  )
}
