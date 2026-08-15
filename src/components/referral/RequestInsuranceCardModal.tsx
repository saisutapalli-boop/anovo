import SidePanel from '@/components/ui/SidePanel'
import Button from '@/components/ui/Button'

export default function RequestInsuranceCardModal({
  patient,
  prescriber,
  onClose,
  onSend,
}: {
  patient: string
  prescriber: string
  onClose: () => void
  onSend: () => void
}) {
  return (
    <SidePanel
      title="Request Insurance Card"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSend}>
            Send Request
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#666666]">Patient</p>
          <p className="mt-1 text-base font-semibold text-[#383838]">{patient}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#666666]">Prescriber</p>
          <p className="mt-1 text-sm font-semibold text-[#383838]">{prescriber}</p>
        </div>
        <div className="rounded-xl border border-[#e5e5e5] bg-[#f5f5f5] p-3 text-sm leading-relaxed text-[#4d4e50]">
          Requesting insurance card for Voxzogo (vosoritide) (NDC 00078-0654-61) · Aetna BIN 004336 / PCN ADV / Member
          AET847293. Required to confirm specialty tier coverage and determine PA pathway before drug-specific BI can
          begin.
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700">SMS</span>
          <span className="rounded-full border border-purple-200 bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-700">
            Secure Portal
          </span>
          <span className="rounded-full border border-[#dddddd] bg-[#f5f5f5] px-3 py-1.5 text-xs font-bold text-[#4d4e50]">
            Email
          </span>
        </div>
      </div>
    </SidePanel>
  )
}
