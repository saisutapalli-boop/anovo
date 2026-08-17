import { useState } from 'react'
import { Check, Send } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import { useDispensingCase } from '@/context/DispensingCaseContext'

interface ActivityEntry {
  text: string
  time: string
  tone: 'done' | 'active'
}

const AUTO_STEPS = [
  { title: 'Prescription received and verified', subtitle: 'AI validated prescription, approved therapy, and patient' },
  { title: 'Insurance/coverage approved', subtitle: 'AI validated active approved coverage for dispensing' },
  { title: 'PA requirements completed', subtitle: 'AI validated prior authorization approval and completion' },
]

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

function StepBadge({ done }: { done: boolean }) {
  return (
    <span
      className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
        done ? 'bg-[#11a84e] text-white' : 'border-2 border-[#cad2d3] text-[#788a95]'
      }`}
    >
      {done ? <Check className="size-4" /> : ''}
    </span>
  )
}

export default function DispensingCaseDetailPage() {
  const { copayStatus, setCopayStatus } = useDispensingCase()
  const { toast, showToast, clearToast } = useToast()
  const [activity, setActivity] = useState<ActivityEntry[]>([
    { text: 'Sarah Mitchell case opened. Steps 1-3 automatically AI validated.', time: nowLabel(), tone: 'done' },
    { text: 'Step 4 ready: Copay confirmation - send message for patient consent.', time: nowLabel(), tone: 'active' },
  ])

  function log(text: string, tone: ActivityEntry['tone'] = 'done') {
    setActivity((prev) => [...prev, { text, time: nowLabel(), tone }])
  }

  function requestCopayConsent() {
    setCopayStatus('requested')
    log('Copay consent request sent to Sarah Mitchell with therapy and copay details.', 'active')
  }

  function simulateConsentReceived() {
    setCopayStatus('received')
    log('Patient consent received for the Voxzogo (vosoritide) copay pathway.', 'active')
    log('Consent confirmed. Preparing Pharmacist Verification view...', 'active')
    log('Case moved to Pharmacist Verification stage.')
    showToast('Moved case to RPh Verification Queue', 'success')
  }

  const readiness = 3 + (copayStatus === 'received' ? 1 : 0)

  return (
    <AppShell active="dispensing" showNav={false}>
      <div className="flex w-full flex-col gap-6">
        <Breadcrumb
          trail={[
            { label: 'Dispensing Hub', href: '/dispensing' },
            { label: 'Sarah Mitchell' },
          ]}
          title="Sarah Mitchell · Voxzogo (vosoritide)"
        />

        {/* AI Readiness Verification */}
        <div className="flex w-full flex-col gap-4 rounded-xl border border-[#dddddd] bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xl font-bold text-brand-teal">AI Readiness Verification</p>
              <p className="text-sm text-[#666666]">
                Steps 1-3 were validated automatically. Use the controls below to complete the two dispensing-readiness
                gates.
              </p>
            </div>
            <Badge tone="success">Steps 1-3 AI Validated</Badge>
          </div>

          <div className="flex flex-col gap-3">
            {AUTO_STEPS.map((s) => (
              <div
                key={s.title}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#11a84e]/25 bg-[#11a84e]/5 p-4"
              >
                <div className="flex items-center gap-3">
                  <StepBadge done />
                  <div>
                    <p className="text-sm font-bold text-[#383838]">{s.title}</p>
                    <p className="text-xs text-[#666666]">{s.subtitle}</p>
                  </div>
                </div>
                <Badge tone="success">AI Validated</Badge>
              </div>
            ))}

            {/* Step 4: Copay confirmation */}
            <div
              className={`flex flex-col gap-3 rounded-lg border p-4 ${
                copayStatus === 'received' ? 'border-[#11a84e]/25 bg-[#11a84e]/5' : 'border-[#e5e5e5] bg-white'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <StepBadge done={copayStatus === 'received'} />
                  <div>
                    <p className="text-sm font-bold text-[#383838]">Copay confirmation</p>
                    <p className="text-xs text-[#666666]">
                      {copayStatus === 'pending' && 'Send message for patient consent'}
                      {copayStatus === 'requested' && 'Awaiting patient response'}
                      {copayStatus === 'received' && 'Consent received from Sarah Mitchell'}
                    </p>
                  </div>
                </div>
                <Badge tone={copayStatus === 'received' ? 'success' : 'neutral'}>
                  {copayStatus === 'received' ? 'AI Validated' : 'Action Needed'}
                </Badge>
              </div>

              {copayStatus !== 'received' && (
                <div className="grid w-full grid-cols-1 gap-4 wide:grid-cols-2">
                  <div className="rounded-lg bg-[#f5f5f5] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#788a95]">Therapy &amp; Copay Details</p>
                    <div className="mt-2 flex flex-col gap-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#666666]">Therapy</span>
                        <span className="font-bold text-[#383838]">Voxzogo (vosoritide)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666666]">Estimated drug cost</span>
                        <span className="font-bold text-[#383838]">$2,760</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666666]">Insurance contribution</span>
                        <span className="font-bold text-[#383838]">$280</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666666]">Estimated patient copay</span>
                        <span className="font-bold text-rose-600">$2,480</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666666]">Financial assistance</span>
                        <span className="font-bold text-[#383838]">Copay pathway</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border border-[#e5e5e5] p-4">
                    <p className="text-sm font-bold text-brand-teal">Patient Consent Request</p>
                    <p className="flex-1 text-xs leading-relaxed text-[#666666]">
                      Send Sarah a consent request explaining the estimated copay and the financial assistance pathway.
                      The patient must consent before the case can proceed.
                    </p>
                    {copayStatus === 'pending' && (
                      <Button onClick={requestCopayConsent} className="w-full">
                        Request Copay Consent
                      </Button>
                    )}
                    {copayStatus === 'requested' && (
                      <>
                        <p className="text-xs font-semibold text-brand-teal">Request sent, awaiting Sarah&rsquo;s response.</p>
                        <Button onClick={simulateConsentReceived} className="w-full">
                          <Send className="size-3.5" />
                          Simulate Consent Received
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Case Activity */}
        <div className="flex w-full flex-col gap-3 rounded-xl border border-[#dddddd] bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-base font-bold text-brand-teal">Case Activity</p>
            <span className="text-xs text-[#788a95]">Live simulation</span>
          </div>
          <div className="flex flex-col gap-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className={`mt-1.5 size-2 shrink-0 rounded-full ${a.tone === 'done' ? 'bg-[#11a84e]' : 'bg-brand-teal'}`} />
                <div>
                  <p className="text-sm font-semibold text-[#383838]">{a.text}</p>
                  <p className="text-[11px] text-[#788a95]">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness + Case Summary */}
        <div className="flex w-full flex-col items-stretch gap-4 wide:flex-row">
          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#dddddd] bg-white p-6">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#788a95]">Readiness</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-brand-teal">{readiness}</span>
              <span className="text-2xl font-bold text-[#cad2d3]">/4</span>
            </div>
            <ProgressBar value={readiness} max={4} color="#11a84e" trackColor="#eaeded" height={8} />
            <p className="text-xs text-[#666666]">
              {readiness < 4
                ? 'Steps 1-3 are automatically AI validated. Step 4 is ready for copay consent.'
                : 'Copay consent received. Case moved to Pharmacist Verification stage.'}
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#dddddd] bg-white p-6">
            <p className="text-base font-bold text-[#383838]">Case Summary</p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#788a95]">Patient</span>
                <span className="font-bold text-[#383838]">Sarah Mitchell</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#788a95]">Therapy</span>
                <span className="font-bold text-[#383838]">Voxzogo (vosoritide)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#788a95]">PA</span>
                <span className="font-bold text-[#0d8a40]">Approved</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#788a95]">Copay</span>
                <span className="font-bold text-[#383838]">$2,480</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#788a95]">Consent</span>
                <span className={`font-bold ${copayStatus === 'received' ? 'text-[#0d8a40]' : 'text-amber-600'}`}>
                  {copayStatus === 'pending' && 'Not Sent'}
                  {copayStatus === 'requested' && 'Requested'}
                  {copayStatus === 'received' && 'Received'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#788a95]">Next step</span>
                <span className="font-bold text-[#383838]">
                  {copayStatus === 'received' ? 'Pharmacist Verification' : 'Copay Confirmation'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} tone={toast.tone} onDone={clearToast} />}
    </AppShell>
  )
}
