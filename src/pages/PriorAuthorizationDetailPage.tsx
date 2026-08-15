import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HelpCircle, AlertTriangle, CheckCircle2 } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import Toast from '@/components/ui/Toast'
import CaseActivityTimeline from '@/components/ui/CaseActivityTimeline'
import { useToast } from '@/hooks/useToast'
import { useDispensingCase } from '@/context/DispensingCaseContext'
import { CASE_REF, HISTORICAL_EVENTS, SIMULATED_EVENTS } from '@/data/sarahMitchellTimeline'

const REQUIREMENTS = [
  'Confirmed documentation of elevated baseline clinical serum enzyme levels',
  'GBA genetic diagnostic mutation test results (fully verified & signed)',
  'Documented neurological spleen and liver high-res volumetric imaging scan',
  'Detailed 12-month historical treatment log with verified clinical outcomes',
]

const COMPLETENESS = [
  { title: 'Enzyme Baseline Log', status: 'Missing Documentation', pass: false },
  { title: 'GBA Genotyping Record', status: 'Missing Documentation', pass: false },
  { title: 'Imaging Scan (Spleen/Liver)', status: 'Missing Documentation', pass: false },
  { title: '12-Month Treatment History', status: 'Missing Documentation', pass: false },
  { title: 'Clinical Diagnosis Present', status: 'Passed Verification', pass: true },
  { title: 'Medical Necessity Letter', status: 'Passed Verification', pass: true },
]

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-[#dddddd] bg-white p-6">
      <p className="text-base font-bold text-[#383838]">{title}</p>
      {children}
    </div>
  )
}

export default function PriorAuthorizationDetailPage() {
  const { caseId } = useParams()
  const { setPaSimulationComplete } = useDispensingCase()
  const { toast, showToast, clearToast } = useToast()
  const [visibleCount, setVisibleCount] = useState(0)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<number | null>(null)

  const complete = visibleCount >= SIMULATED_EVENTS.length

  function runSimulation() {
    if (running || complete) return
    setRunning(true)
    let count = visibleCount
    timerRef.current = window.setInterval(() => {
      count += 1
      setVisibleCount(count)
      if (count >= SIMULATED_EVENTS.length) {
        window.clearInterval(timerRef.current!)
        setRunning(false)
        setPaSimulationComplete(true)
        showToast('PA simulation complete · case moved to Dispensing Queue', 'success')
      }
    }, 850)
  }

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current)
  }, [])

  const events = [...HISTORICAL_EVENTS, ...SIMULATED_EVENTS.slice(0, visibleCount)]

  return (
    <AppShell active="prior-authorization" showNav={false}>
      <div className="flex w-full flex-col gap-6">
        <Breadcrumb
          trail={[
            { label: 'Prior Authorization', href: '/prior-authorization' },
            { label: 'Sarah Mitchell' },
          ]}
          title="Sarah Mitchell · Prior Authorization"
        />

        <SectionCard title="1. Automated Eligibility Check">
          <div className="w-full overflow-x-auto rounded-lg border border-[#e5e5e5]">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e5e5e5] bg-[#f5f5f5] text-[10px] font-bold uppercase tracking-wider text-[#666666]">
                  <th className="px-6 py-3">Payer</th>
                  <th className="px-3 py-3">Coverage Status</th>
                  <th className="px-3 py-3">PA Required</th>
                  <th className="px-3 py-3">Formulary Tier</th>
                  <th className="px-3 py-3">Deductible Progress</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-sm">
                  <td className="px-6 py-4 font-semibold text-[#383838]">Aetna PPO</td>
                  <td className="px-3 py-4">
                    <Badge tone="success">Active</Badge>
                  </td>
                  <td className="px-3 py-4">
                    <Badge tone="info">Yes</Badge>
                  </td>
                  <td className="px-3 py-4 text-[#4d4e50]">Tier 4 Specialty</td>
                  <td className="px-3 py-4">
                    <div className="flex w-full flex-col gap-1.5">
                      <div className="flex justify-between text-xs text-[#4d4e50]">
                        <span>$2,400 Met</span>
                        <span>of $4,000</span>
                      </div>
                      <ProgressBar value={60} color="#055979" trackColor="#eaeded" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="2. Payer Intelligence: Required Clinical Documentation (Aetna)">
          <div className="w-full rounded-lg border border-[#e5e5e5] bg-[#f5f5f5] p-5">
            <div className="mb-3 flex items-center gap-2">
              <HelpCircle className="size-4 text-brand-teal" />
              <p className="text-sm font-bold text-[#383838]">Prior Authorization Requirements Checklist</p>
            </div>
            <ul className="flex flex-col gap-2">
              {REQUIREMENTS.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-sm text-[#4d4e50]">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#788a95]" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>

        <SectionCard title="3. Referral Document Completeness Check">
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
            {COMPLETENESS.map((c) => (
              <div key={c.title} className="flex items-start gap-3 rounded-lg border border-[#e5e5e5] p-4">
                <div
                  className={`flex size-[26px] shrink-0 items-center justify-center rounded-full ${
                    c.pass ? 'bg-[#11a84e]/10' : 'bg-amber-100'
                  }`}
                >
                  {c.pass ? (
                    <CheckCircle2 className="size-3.5 text-[#11a84e]" />
                  ) : (
                    <AlertTriangle className="size-3.5 text-amber-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#383838]">{c.title}</p>
                  <p className={`text-xs ${c.pass ? 'text-[#0d8a40]' : 'text-amber-700'}`}>{c.status}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <CaseActivityTimeline
          title={`Sarah Mitchell · Case Timeline`}
          subtitle={`${CASE_REF} · End-to-end PA activity`}
          events={events}
          dividerLabel="Today · Simulation Begins"
          dividerIndex={HISTORICAL_EVENTS.length}
          badge={
            complete ? (
              <Badge tone="success">
                Simulation complete · {SIMULATED_EVENTS.length} of {SIMULATED_EVENTS.length} events
              </Badge>
            ) : (
              <Button onClick={runSimulation} disabled={running}>
                {running ? 'Running simulation...' : visibleCount > 0 ? 'Resume Simulation' : `Run Simulation (Case ${caseId ?? '1'})`}
              </Button>
            )
          }
        />
      </div>

      {toast && <Toast message={toast.message} tone={toast.tone} onDone={clearToast} />}
    </AppShell>
  )
}
