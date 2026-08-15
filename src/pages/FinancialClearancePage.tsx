import { useState } from 'react'
import { AlertTriangle, MessageSquare, Phone, Plus } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'

interface LogEntry {
  channel: 'SMS' | 'Phone'
  text: string
  meta: string
}

const INITIAL_LOG: LogEntry[] = [
  {
    channel: 'SMS',
    text: 'Informed Sarah of ~$680 copay estimate and assistance options available',
    meta: 'Today 10:15 AM · Delivered ✓ · Read 10:22 AM',
  },
  {
    channel: 'Phone',
    text: 'Sarah confirmed interest in Novartis PAP · income qualifies · call notes saved',
    meta: 'Today 10:45 AM · 12 min call · Event: FinancialConversationLogged',
  },
]

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export default function FinancialClearancePage() {
  const { toast, showToast, clearToast } = useToast()
  const [papStarted, setPapStarted] = useState(false)
  const [eligibilityChecked, setEligibilityChecked] = useState(false)
  const [log, setLog] = useState<LogEntry[]>(INITIAL_LOG)

  function startPapApplication() {
    setPapStarted(true)
    showToast('Novartis ACCESS+ application started for Sarah Mitchell', 'success')
  }

  function checkHealthWellEligibility() {
    setEligibilityChecked(true)
    showToast('HealthWell Foundation eligibility check submitted', 'neutral')
  }

  function logCommunication() {
    setLog((prev) => [
      ...prev,
      {
        channel: 'Phone',
        text: 'Follow-up note logged by care coordination team',
        meta: `Today ${nowLabel()} · Manual entry · Event: FinancialConversationLogged`,
      },
    ])
    showToast('Communication logged', 'success')
  }

  return (
    <AppShell active="prior-authorization" showNav={false}>
      <div className="flex w-full flex-col gap-6">
        <Breadcrumb
          trail={[
            { label: 'Prior Authorization', href: '/prior-authorization' },
            { label: 'Sarah Mitchell' },
          ]}
          title="Sarah Mitchell · Financial Clearance"
        />

        <div className="flex w-full flex-col gap-5 rounded-xl border border-[#dddddd] bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#f0f0f0] pb-5">
            <div>
              <p className="text-xl font-bold text-brand-teal">Financial Clearance &mdash; Sarah Mitchell</p>
              <p className="text-sm text-[#666666]">ANV-2026-10482 &middot; Signifor LAR &middot; Est. copay ~$680/shipment</p>
            </div>
            <Badge tone="warning" className="gap-1">
              <AlertTriangle className="size-3" />
              High Copay Risk
            </Badge>
          </div>

          {/* Risk banner */}
          <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <p className="text-sm font-bold text-amber-900">
                Signifor LAR specialty tier copay: ~$680/shipment &mdash; above abandonment threshold
              </p>
            </div>
            <p className="text-xs leading-relaxed text-amber-800">
              Ultra-orphan drug with no generic alternative. Patients with out-of-pocket &gt;$500 abandon at 2.1x the
              baseline rate at Cycle 2 (first shipment after deductible resets). Manufacturer copay card and/or PAP
              must be applied before patient consent is requested &mdash; this is the BI&rsquo;s responsibility to
              resolve before the drug can be dispensed.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge tone="neutral">Drug: Signifor LAR &middot; Novartis</Badge>
              <Badge tone="neutral">NDC: 00078-0654-61</Badge>
              <Badge tone="warning">Specialty Tier 4 &middot; $4,000 deductible</Badge>
              <Badge tone="error">REMS Drug &mdash; No substitute</Badge>
            </div>
          </div>

          {/* Financial assistance programs */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-teal">Available Financial Assistance Programs</p>
            <div className="grid w-full grid-cols-1 gap-4 wide:grid-cols-2">
              <div className="flex flex-col gap-2.5 rounded-xl border border-[#11a84e]/30 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-[#383838]">Novartis PAP</p>
                    <p className="text-xs text-[#788a95]">Patient Assistance Program &middot; Income-based</p>
                  </div>
                  <Badge tone="success">{papStarted ? 'Application Started' : 'Eligible'}</Badge>
                </div>
                <p className="flex-1 text-xs leading-relaxed text-[#666666]">
                  Signifor LAR-specific PAP. Copay reduced to $0 for patients earning &lt;400% FPL. Manufacturer:
                  Novartis Pharmaceuticals. Application turnaround: 3-5 business days. Drug supply direct from
                  Novartis if approved.
                </p>
                <button
                  type="button"
                  onClick={startPapApplication}
                  disabled={papStarted}
                  className="inline-flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-md bg-[#11a84e] px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:bg-[#0d8a40] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
                >
                  {papStarted ? 'Application In Progress' : 'Start Novartis ACCESS+ Application'}
                </button>
              </div>

              <div className="flex flex-col gap-2.5 rounded-xl border border-sky-300 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-[#383838]">HealthWell Foundation</p>
                    <p className="text-xs text-[#788a95]">Acromegaly fund &middot; Insurance required</p>
                  </div>
                  <Badge tone="warning">{eligibilityChecked ? 'Check Submitted' : 'Check Eligibility'}</Badge>
                </div>
                <p className="flex-1 text-xs leading-relaxed text-[#666666]">
                  Grant up to $10,000/year for specialty drug copays. Covers Signifor LAR under Acromegaly fund. Fund
                  status: Open. Requires active insurance. Decision within 24-48 hours. Does not conflict with PAP
                  eligibility.
                </p>
                <Button onClick={checkHealthWellEligibility} disabled={eligibilityChecked} className="w-full">
                  {eligibilityChecked ? 'Eligibility Check Submitted' : 'Check Eligibility'}
                </Button>
              </div>
            </div>
          </div>

          {/* Conversation log */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-teal">Patient Financial Conversation Log</p>
            <div className="flex flex-col gap-2">
              {log.map((entry, i) => (
                <div key={i} className="flex animate-fade-in items-start gap-3 rounded-lg border border-[#e5e5e5] p-4">
                  <Badge tone="info" className="mt-0.5 gap-1">
                    {entry.channel === 'SMS' ? <MessageSquare className="size-3" /> : <Phone className="size-3" />}
                    {entry.channel}
                  </Badge>
                  <div>
                    <p className="text-sm font-semibold text-[#383838]">{entry.text}</p>
                    <p className="text-xs text-[#788a95]">{entry.meta}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" onClick={logCommunication} className="self-start">
              <Plus className="size-3.5" />
              Log New Communication
            </Button>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} tone={toast.tone} onDone={clearToast} />}
    </AppShell>
  )
}
