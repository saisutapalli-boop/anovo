import { useState } from 'react'
import SidePanel from '@/components/ui/SidePanel'
import Button from '@/components/ui/Button'

export default function EditDrugStrengthModal({
  initialValue,
  onClose,
  onSave,
}: {
  initialValue: string
  onClose: () => void
  onSave: (value: string) => void
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <SidePanel
      title="Edit Drug Strength"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => onSave(value)}>
            Save Changes
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#666666]">Drug Strength</p>
          <p className="mt-1 text-xs text-[#666666]">Update the extracted strength. Use the value shown on the referral / Rx.</p>
        </div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-lg border border-[#dddddd] px-3.5 py-3 text-sm font-semibold text-[#383838] outline-none focus:border-brand-teal"
          autoFocus
        />
      </div>
    </SidePanel>
  )
}
