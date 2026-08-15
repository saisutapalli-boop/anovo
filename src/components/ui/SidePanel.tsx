import { X } from 'lucide-react'

export default function SidePanel({
  title,
  onClose,
  children,
  footer,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-[360px] flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[50px] shrink-0 items-center justify-between px-4">
          <p className="text-base font-semibold text-[#383838]">{title}</p>
          <button onClick={onClose} aria-label="Close" className="text-[#788a95] hover:text-[#383838]">
            <X className="size-5" />
          </button>
        </div>
        <div className="h-px w-full bg-[#e5e5e5]" />
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        {footer && (
          <>
            <div className="h-px w-full bg-[#e5e5e5]" />
            <div className="flex shrink-0 items-center justify-end gap-2 px-4 py-3">{footer}</div>
          </>
        )}
      </div>
    </div>
  )
}
