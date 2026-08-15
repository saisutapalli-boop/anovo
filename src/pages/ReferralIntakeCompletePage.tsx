import { useParams, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import Button from '@/components/ui/Button'
import ProgressRing from '@/components/ui/ProgressRing'

const CHECKLIST = [
  'Patient demographics verified · no duplicate MPI record detected',
  'Prescriber NPI active (NPPES) · state DEA registration confirmed active',
  'Drug NDC validated via Medispan matching catalog',
  'Drug dosage strength confirmed · 0.24mg/kg IM injection daily',
  'REMS and cold-chain tags validated & applied to shipment profile',
  'Pharmacy benefit card scanned copy matched to patient eligibility record',
]

export default function ReferralIntakeCompletePage() {
  const { caseId } = useParams()
  const navigate = useNavigate()

  return (
    <AppShell active="referral-intake">
      <div className="flex w-full flex-col gap-6">
        {/* Ready for BI */}
        <div className="flex w-full flex-wrap items-center justify-between gap-4 rounded-xl border border-[#dddddd] bg-white p-8">
          <div className="flex max-w-xl flex-col gap-2">
            <p className="text-2xl tracking-[-0.12px] text-[#383838]">Ready for Benefit Investigation</p>
            <p className="text-sm text-[#666666]">
              Send this verified case folder directly to the primary BI investigator queue to establish
              prior-authorization rules.
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')}>Send to BI Queue &rarr;</Button>
        </div>

        {/* Success banner */}
        <div className="flex w-full items-center gap-8 rounded-xl border border-[#dddddd] bg-white p-8">
          <ProgressRing value={100} size={80} thickness={10} color="#11a84e" trackColor="#eaeded">
            <span className="text-xl font-bold text-[#383838]">100%</span>
            <span className="text-[10px] font-semibold text-[#4d4e50]">Complete</span>
          </ProgressRing>
          <div className="flex flex-col gap-1.5">
            <p className="text-2xl tracking-[-0.12px] text-[#383838]">Intake Complete</p>
            <p className="text-sm text-[#666666]">
              All required intake checks are complete. The case is verified and ready for Benefit Investigation.
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="flex w-full flex-col gap-4 rounded-xl border border-[#dddddd] bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-2xl tracking-[-0.12px] text-[#383838]">Intake Completion Checklist</p>
            <span className="whitespace-nowrap rounded-full bg-[#11a84e]/10 px-3 py-1 text-xs font-bold text-[#0d8a40]">
              ✓ ALL COMPLETE
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {CHECKLIST.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-[#383838]">
                <Check className="mt-0.5 size-4 shrink-0 rounded-full bg-[#11a84e]/10 p-0.5 text-[#11a84e]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-[#788a95]">Case {caseId ?? '1'} · REF-1984-SM01</p>
      </div>
    </AppShell>
  )
}
