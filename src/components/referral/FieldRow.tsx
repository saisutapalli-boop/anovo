import { Check, AlertTriangle } from 'lucide-react'
import Button from '@/components/ui/Button'

export type FieldTone = 'verified' | 'flagged' | 'info'

interface FieldRowProps {
  label: string
  value: string
  tone?: FieldTone
  confidence?: string
  tagLabel?: string
  note?: string
  onEdit?: () => void
  onConfirm?: () => void
}

export default function FieldRow({ label, value, tone = 'verified', confidence, tagLabel, note, onEdit, onConfirm }: FieldRowProps) {
  const flagged = tone === 'flagged'
  return (
    <div className={`flex w-full flex-col gap-2 border-b border-[#f0f0f0] px-4 py-3 last:border-b-0 ${flagged ? 'bg-amber-50' : ''}`}>
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-1.5 text-[13px] font-bold text-[#666666]">
            {flagged && <AlertTriangle className="size-3.5 text-amber-600" />}
            {label}
          </p>
          <p className="text-base font-semibold text-[#383838]">{value}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {confidence && !flagged && (
            <span className="flex items-center gap-1 rounded-full bg-[#11a84e]/10 px-2.5 py-1 text-[11px] font-bold text-[#0d8a40]">
              <Check className="size-2.5" /> {confidence}
            </span>
          )}
          {flagged && (
            <span className="whitespace-nowrap rounded-full bg-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-900">
              {tagLabel ?? confidence}
            </span>
          )}
          {(onEdit || onConfirm) && (
            <div className="flex gap-1.5">
              {onEdit && (
                <Button size="sm" variant="secondary" onClick={onEdit} className="!px-2.5 !py-1 text-[11px]">
                  Edit
                </Button>
              )}
              {onConfirm && (
                <Button size="sm" onClick={onConfirm} className="!bg-amber-500 !px-2.5 !py-1 text-[11px] hover:!bg-amber-600">
                  Confirm
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {note && <p className="text-xs text-[#666666]">{note}</p>}
    </div>
  )
}
