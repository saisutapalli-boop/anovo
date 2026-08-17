import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HelpCircle, AlertTriangle, CheckCircle2, Send, Workflow, Play, FileText } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
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

const SIMULATION_STEPS = [
  { n: 1, label: 'Eligibility', color: '#055979' },
  { n: 2, label: 'Exceptions', color: '#e67e22' },
  { n: 3, label: 'ePA', color: '#129fea' },
  { n: 4, label: 'Dispensing', color: '#11a84e' },
]

function SimulationLauncherCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-xl border border-[#dddddd] bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal text-white">
            <Workflow className="size-5" />
          </span>
          <div>
            <p className="text-base font-bold text-brand-teal">End-to-End PA Simulation</p>
            <p className="text-xs text-[#666666]">
              Automated payer check &rarr; exception handling &rarr; ePA &rarr; approval &rarr; dispensing
            </p>
          </div>
        </div>
        <Badge tone="info">BI workflow</Badge>
      </div>

      <div className="flex w-full items-start justify-around">
        {SIMULATION_STEPS.map((s) => (
          <div key={s.n} className="flex flex-col items-center gap-2">
            <span
              className="flex size-9 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: s.color }}
            >
              {s.n}
            </span>
            <span className="text-xs font-semibold text-[#383838]">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onStart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-teal-dark px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-teal active:scale-[0.99]"
        >
          <Play className="size-4 fill-white" />
          Start End-to-End Simulation
        </button>
        <p className="text-xs text-[#788a95]">After launch, the timeline runs automatically. No additional action is required.</p>
      </div>
    </div>
  )
}

export default function PriorAuthorizationDetailPage() {
  const navigate = useNavigate()
  const { setPaSimulationComplete } = useDispensingCase()
  const { toast, showToast, clearToast } = useToast()
  const [visibleCount, setVisibleCount] = useState(0)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<number | null>(null)

  const complete = visibleCount >= SIMULATED_EVENTS.length
  const started = running || visibleCount > 0

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
            {COMPLETENESS.map((c) => {
              const sentToPayer = !c.pass && complete
              return (
                <div key={c.title} className="flex items-start gap-3 rounded-lg border border-[#e5e5e5] p-4">
                  <div
                    className={`flex size-[26px] shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                      c.pass ? 'bg-[#11a84e]/10' : sentToPayer ? 'bg-sky-100' : 'bg-amber-100'
                    }`}
                  >
                    {c.pass ? (
                      <CheckCircle2 className="size-3.5 text-[#11a84e]" />
                    ) : sentToPayer ? (
                      <Send className="size-3.5 text-sky-600" />
                    ) : (
                      <AlertTriangle className="size-3.5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#383838]">{c.title}</p>
                    <p
                      className={`text-xs transition-colors duration-300 ${
                        c.pass ? 'text-[#0d8a40]' : sentToPayer ? 'text-sky-700' : 'text-amber-700'
                      }`}
                    >
                      {c.pass ? c.status : sentToPayer ? 'Documents sent to payer' : c.status}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>

        {!started ? (
          <SimulationLauncherCard onStart={runSimulation} />
        ) : (
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
                <Badge tone="info">
                  Simulating&hellip; {visibleCount} of {SIMULATED_EVENTS.length} events
                </Badge>
              )
            }
          />
        )}

        <div className="flex w-full flex-wrap items-center justify-between gap-4 rounded-xl border border-[#dddddd] bg-white p-6">
          <p className="flex items-center gap-2 text-xs text-[#666666]">
            <FileText className="size-3.5" />
            {complete
              ? 'PA approved for Sarah Mitchell · Voxzogo (vosoritide) · Aetna PPO · Est. patient copay $2,480. Ready to move to Dispensing.'
              : 'Run the end-to-end simulation to complete prior authorization for Sarah Mitchell.'}
          </p>
          <Button disabled={!complete} onClick={() => navigate('/prior-authorization')}>
            Complete PA Authorization &rarr;
          </Button>
        </div>
      </div>

      {toast && <Toast message={toast.message} tone={toast.tone} onDone={clearToast} />}
    </AppShell>
  )
}
