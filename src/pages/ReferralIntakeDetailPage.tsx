import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, Send, CheckCircle2, FileText } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Button from '@/components/ui/Button'
import FieldRow from '@/components/referral/FieldRow'
import EditFieldModal from '@/components/referral/EditFieldModal'
import RequestInsuranceCardModal from '@/components/referral/RequestInsuranceCardModal'

type CardStep = 'missing' | 'requested' | 'received'

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="w-full border-b border-[#f0f0f0] px-4 py-4">
      <p className="text-base font-bold text-[#383838]">{title}</p>
    </div>
  )
}

export default function ReferralIntakeDetailPage() {
  const { caseId } = useParams()
  const navigate = useNavigate()

  const [cardStep, setCardStep] = useState<CardStep>('missing')
  const [doseConfirmed, setDoseConfirmed] = useState(false)
  const [doseValue, setDoseValue] = useState('40 mg/vial')
  const [editingDose, setEditingDose] = useState(false)
  const [deaConfirmed, setDeaConfirmed] = useState(false)
  const [deaValue, setDeaValue] = useState('BC1234563')
  const [editingDea, setEditingDea] = useState(false)
  const [requestingCard, setRequestingCard] = useState(false)

  const allConfirmed = doseConfirmed && deaConfirmed && cardStep === 'received'

  return (
    <AppShell active="referral-intake" showNav={false}>
      <div className="flex w-full flex-col gap-6 wide:h-full">
        <Breadcrumb
          trail={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Referral Intakes', href: '/referral-intake' },
            { label: 'Sarah Mitchell' },
          ]}
          title="Sarah Mitchell · REF-1984-SM01"
        />

        <div className="flex w-full flex-1 flex-col items-stretch gap-6 wide:min-h-0 wide:flex-row">
          {/* Left: referral document preview, stays put while the right panel scrolls */}
          <div className="w-full shrink-0 rounded-xl border border-[#e5e5e5] bg-[#f5f5f5] p-5 wide:sticky wide:top-0 wide:w-[420px] wide:self-start">
            <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-wider text-[#666666]">
              Referral_Fax_{caseId ?? '10482'}.pdf
            </p>
            <div className="space-y-3 rounded-md border border-[#dddddd] bg-white p-5 font-mono text-[11px] leading-relaxed text-[#383838]">
              <div className="border-b-2 border-[#383838] pb-2 text-center">
                <p className="text-xs font-bold uppercase text-brand-teal">Specialty Drug Enrollment &amp; Referral Form</p>
                <p className="text-[9px] text-[#788a95]">Greenfield Medical Associates · 420 Oak St, Nashville TN 37201</p>
              </div>
              <div>
                <p className="border-b border-[#dddddd] pb-1 font-bold">PATIENT</p>
                <p>Mitchell, Sarah · DOB: 03/15/1989 · (615) 555-0134</p>
                <p>891 Maple Ave, Nashville TN 37203</p>
              </div>
              <div>
                <p className="border-b border-[#dddddd] pb-1 font-bold">PRESCRIBING PHYSICIAN</p>
                <p>Dr. James Carter · NPI: 1234567890</p>
                <p>Greenfield Medical Associates · State: TN</p>
              </div>
              <div>
                <p className="border-b border-[#dddddd] pb-1 font-bold">DRUG / THERAPY</p>
                <p>Voxzogo (vosoritide) · NDC: 00078-0654-61</p>
                <p>Strength: {doseValue} · Route: IM Injection</p>
                <p>ICD-10: Q77.4 (Achondroplasia)</p>
              </div>
              <div>
                <p className="border-b border-[#dddddd] pb-1 font-bold">PHARMACY BENEFIT</p>
                <p>Payer: Aetna · Plan: PPO Commercial</p>
                <p>Rx BIN: 004336 · PCN: ADV · PA Required: YES</p>
              </div>
              <p className="border-t border-[#383838] pt-2 text-[10px] italic">
                Physician Signature: James Carter MD · Date: 08/10/2026
              </p>
            </div>
          </div>

          {/* Right: AI Extracted Fields, the only panel that scrolls */}
          <div className="flex w-full flex-1 flex-col overflow-y-auto rounded-xl border border-[#e5e5e5] bg-white wide:min-h-0">
            <div className="w-full px-4 py-4">
              <p className="text-2xl tracking-[-0.12px] text-[#383838]">AI Extracted Fields</p>
              <p className="text-sm text-[#788a95]">Auto-populated from OCR · Review and confirm each field</p>
            </div>
            <div className="h-2 w-full bg-[#f5f5f5]" />

            <SectionHeader title="Patient Demographics" />
            <FieldRow label="Full Name" value="Sarah Mitchell" confidence="98%" />
            <FieldRow label="Date of Birth" value="03/15/1989" confidence="97%" />
            <FieldRow label="Phone" value="(615) 555-0134" confidence="95%" />
            <div className="h-2 w-full bg-[#f5f5f5]" />

            <SectionHeader title="Prescriber Information" />
            <FieldRow label="Physician Name" value="Dr. James Carter" confidence="NPPES Active · 99%" />
            <FieldRow label="Prescriber NPI" value="1234567890" confidence="NPPES Active" />
            <FieldRow
              label="DEA Number"
              value={deaValue}
              tone={deaConfirmed ? 'verified' : 'flagged'}
              confidence={deaConfirmed ? '✓ Confirmed' : undefined}
              tagLabel="Flagged · 61%"
              note={deaConfirmed ? undefined : 'NPI lookup verification failed - confirm manually'}
              onEdit={deaConfirmed ? undefined : () => setEditingDea(true)}
              onConfirm={deaConfirmed ? undefined : () => setDeaConfirmed(true)}
            />
            <div className="h-2 w-full bg-[#f5f5f5]" />

            <SectionHeader title="Prescription Details" />
            <FieldRow label="Drug Name" value="Voxzogo (vosoritide)" confidence="96%" />
            <FieldRow label="NDC" value="00078-0654-61" confidence="Medispan Match" />
            <FieldRow label="Dosage / SIG" value="0.24 mg/kg · Daily" confidence="91%" />
            <FieldRow label="Route / Days Supply" value="IM Injection · 28 days · Qty: 1 kit" confidence="93%" />
            <FieldRow label="Cold-Chain Flag" value="2°C-8°C · Overnight required" confidence="Flagged" />
            <FieldRow label="Diagnosis Code" value="Achondroplasia (ICD-10: Q77.4)" confidence="93%" />
            <FieldRow
              label="Drug Strength - Confirm"
              value={doseValue}
              tone={doseConfirmed ? 'verified' : 'flagged'}
              confidence={doseConfirmed ? '✓ Confirmed' : undefined}
              tagLabel="Action Needed · 72%"
              note={doseConfirmed ? undefined : "OCR read '40' - verify against Rx; available strengths 10 mg / 20 mg / 40 mg / 60 mg"}
              onEdit={doseConfirmed ? undefined : () => setEditingDose(true)}
              onConfirm={doseConfirmed ? undefined : () => setDoseConfirmed(true)}
            />
            <div className="h-2 w-full bg-[#f5f5f5]" />

            {/* Insurance card status banner */}
            <div className="w-full border-b border-[#f0f0f0] px-4 py-4">
              {cardStep !== 'received' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-base font-bold text-[#383838]">
                      <AlertTriangle className="size-4 text-amber-600" />
                      Step 2: Missing Document
                    </div>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                      {cardStep === 'missing' ? 'Action Required' : 'Request sent'}
                    </span>
                  </div>
                  <p className="text-sm text-[#666666]">
                    Insurance card copy is missing. Patient must provide an active insurance card to complete hub
                    enrollment and process drug access. Document must accompany referral.
                  </p>
                  {cardStep === 'missing' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setRequestingCard(true)}>
                        Request Insurance Card &rarr;
                      </Button>
                      <Button size="sm" variant="secondary">
                        Upload Manually
                      </Button>
                    </div>
                  )}
                  {cardStep === 'requested' && (
                    <div className="flex items-center justify-between gap-4 rounded-lg bg-[#eff6ff] p-3">
                      <div className="flex items-start gap-2">
                        <Send className="mt-0.5 size-4 shrink-0 text-blue-600" />
                        <div>
                          <p className="text-sm font-semibold text-[#383838]">Request sent to Sarah Mitchell</p>
                          <p className="text-xs text-[#666666]">Secure portal request sent for insurance card.</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => setCardStep('received')}>
                        Simulate Card Received &rarr;
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {cardStep === 'received' && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-base font-bold text-[#383838]">
                    <CheckCircle2 className="size-4 text-[#11a84e]" />
                    Insurance card received and matched
                  </div>
                  <p className="text-sm text-[#666666]">
                    Aetna · BIN 004336 · PCN ADV · Group GRP10982 · Member AET847293
                  </p>
                </div>
              )}
            </div>

            <div className="flex w-full items-center justify-between gap-4 border-t border-[#f0f0f0] p-4">
              <p className="flex items-center gap-2 text-xs text-[#666666]">
                <FileText className="size-3.5" />
                {allConfirmed ? 'All fields confirmed. Ready to complete intake.' : 'Confirm flagged fields and attach the insurance card to complete intake.'}
              </p>
              <Button disabled={!allConfirmed} onClick={() => navigate(`/referral-intake/${caseId}/complete`)}>
                Complete Intake &rarr;
              </Button>
            </div>
          </div>
        </div>
      </div>

      {editingDose && (
        <EditFieldModal
          title="Edit Drug Strength"
          fieldLabel="Drug Strength"
          description="Update the extracted strength. Use the value shown on the referral / Rx."
          initialValue={doseValue}
          onClose={() => setEditingDose(false)}
          onSave={(v) => {
            setDoseValue(v)
            setDoseConfirmed(false)
            setEditingDose(false)
          }}
        />
      )}
      {editingDea && (
        <EditFieldModal
          title="Edit DEA Number"
          fieldLabel="DEA Number"
          description="Update the extracted DEA number. Use the value shown on the referral / Rx."
          initialValue={deaValue}
          onClose={() => setEditingDea(false)}
          onSave={(v) => {
            setDeaValue(v)
            setDeaConfirmed(false)
            setEditingDea(false)
          }}
        />
      )}
      {requestingCard && (
        <RequestInsuranceCardModal
          patient="Sarah Mitchell"
          prescriber="Dr. James Carter, MD"
          onClose={() => setRequestingCard(false)}
          onSend={() => {
            setCardStep('requested')
            setRequestingCard(false)
          }}
        />
      )}
    </AppShell>
  )
}
