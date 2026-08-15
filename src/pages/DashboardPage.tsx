import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import KpiCard from '@/components/ui/KpiCard'
import DonutLegend from '@/components/ui/DonutLegend'
import BarLegend from '@/components/ui/BarLegend'
import ProgressBar from '@/components/ui/ProgressBar'
import ProgressRing from '@/components/ui/ProgressRing'
import CaseTimeline from '@/components/ui/CaseTimeline'
import StatusChip from '@/components/ui/StatusChip'
import AnimatedBar from '@/components/ui/AnimatedBar'

const TEAL = '#055979'
const GREEN = '#11a84e'
const ORANGE = '#e67e22'
const BLUE = '#129fea'
const RED = '#e9322d'

function AttentionItem({
  title,
  chip,
  chipTone,
  description,
  step,
  onResolve,
}: {
  title: string
  chip: string
  chipTone: string
  description: string
  step: number
  onResolve: () => void
}) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center gap-2 rounded-t-lg border border-[#cad2d3] bg-white p-4">
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <p className="text-base text-[#383838]">{title}</p>
            <span
              className="whitespace-nowrap rounded-md px-2 py-1 text-[11px]"
              style={{ background: chipTone === 'error' ? '#fdf2f1' : '#fef5ec', color: chipTone === 'error' ? RED : ORANGE }}
            >
              {chip}
            </span>
          </div>
          <p className="text-sm text-[#666666]">{description}</p>
        </div>
        <button
          onClick={onResolve}
          className="group flex shrink-0 items-center gap-1 rounded-md bg-[#fefefe] px-2 py-1.5 text-sm text-[#4d4e50] transition-colors duration-200 hover:bg-brand-teal/5 hover:text-brand-teal"
        >
          Resolve
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
      <CaseTimeline currentStep={step} />
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <AppShell active="dashboard">
      <div className="flex w-full flex-col gap-4">
        <p className="text-2xl tracking-[-0.12px] text-[#383838]">Good afternoon, Alex Morgan</p>

        {/* KPI Row */}
        <div className="flex w-full flex-col items-stretch gap-4 wide:flex-row">
          <KpiCard
            title="Pipeline Overview"
            chip="Referal Intake"
            metricValue="1,846"
            metricLabel="Total Inbound"
            metricColor={TEAL}
            linkLabel="Intake details"
            linkTo="/referral-intake"
          >
            <DonutLegend
              centerValue="2.9K"
              centerLabel="Active"
              items={[
                { value: 1108, color: TEAL, label: 'In Processing', valueLabel: '1,108' },
                { value: 369, color: GREEN, label: 'validated' },
                { value: 277, color: ORANGE, label: 'Missing Info' },
                { value: 92, color: RED, label: 'SLA Warning' },
              ]}
            />
          </KpiCard>

          <KpiCard
            title="Patient Adherence"
            chip="BI / Prior Authorization"
            metricValue="245"
            metricLabel="Active Cases"
            metricColor={GREEN}
            linkLabel="Authorization Queue"
            linkTo="/prior-authorization"
          >
            <BarLegend
              containerClassName="flex h-[90px] w-[120px] shrink-0 items-end justify-center gap-1.5 rounded-lg bg-[#f5f5f5] p-2"
              barClassName="w-3 rounded-t-sm"
              bars={[
                { size: 45, color: GREEN, label: 'Under Review', value: '227' },
                { size: 20, color: ORANGE, label: 'Approved', value: '11' },
                { size: 35, color: BLUE, label: 'Appeal Pending Info', value: '5' },
                { size: 30, color: RED, label: 'Denied / Appeal', value: '2' },
              ]}
            />
          </KpiCard>

          <KpiCard
            title="Cold-Chain Guard"
            chip="Dispensing Operations"
            metricValue="849"
            metricLabel="Total Executed"
            metricColor={TEAL}
            linkLabel="Dispatch & Verification"
            linkTo="/dashboard"
          >
            <BarLegend
              axis="width"
              containerClassName="flex h-[90px] w-[120px] shrink-0 flex-col items-start justify-center gap-1.5 rounded-lg bg-[#f5f5f5] p-2 pb-4"
              barClassName="h-3 rounded-sm"
              bars={[
                { size: 36, color: TEAL, label: 'Ready to Dispense', value: '479' },
                { size: 28, color: GREEN, label: 'Pharmacist Verification', value: '153' },
                { size: 24, color: ORANGE, label: 'Shipping Status', value: '217' },
              ]}
            />
          </KpiCard>
        </div>

        {/* Attention Required + Performance */}
        <div className="flex w-full flex-col items-stretch gap-4 wide:flex-row">
          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#e67e22] bg-[#fef5ec] p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-[18px] text-[#e67e22]" />
              <p className="text-2xl tracking-[-0.12px] text-[#383838]">Attention Required (Critical Flags)</p>
            </div>
            <AttentionItem
              title="Sarah Mitchell Case RX-2024-4892"
              chip="OCR Review Needed"
              chipTone="error"
              description="Fax Review Pending: Low Confidence OCR flag on Diagnosis Code & NPI registration for Voxzogo."
              step={2}
              onResolve={() => navigate('/referral-intake/1')}
            />
            <AttentionItem
              title="Insurance Card Missing · Sarah Mitchell"
              chip="Document Gap"
              chipTone="warning"
              description="Payer match success (UnitedHealthcare) but front/back digital scan is missing from the master payload."
              step={3}
              onResolve={() => navigate('/referral-intake/1')}
            />
          </div>

          <div className="flex w-full flex-col gap-5 wide:w-[448px]">
            <div className="flex flex-col gap-3 rounded-xl border border-[#e2e8f0] bg-white p-6">
              <p className="text-2xl tracking-[-0.12px] text-[#383838]">Team Performance Index</p>
              <div className="flex items-center gap-4">
                <ProgressRing value={92} size={120} thickness={16} color="#007e8a" trackColor="#eaeded">
                  <span className="text-[28px] font-extrabold text-[#007e8a]">92%</span>
                </ProgressRing>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-base font-bold text-[#1a202c]">Target Exceeded</p>
                  <p className="text-xs text-[#718096]">Referral processed on SLA time.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#e2e8f0] bg-white p-6">
              <p className="text-2xl tracking-[-0.12px] text-[#383838]">Real-Time Audit Trail</p>
              <div className="flex flex-col gap-2.5 text-xs text-[#4a5568]">
                <p><span className="font-bold">System:</span> Ingested Inbound Fax for Sarah Mitchell (0.24mg/kg daily).</p>
                <p><span className="font-bold">Alex Morgan:</span> Verified insurance eligibility for David Ross.</p>
                <p><span className="font-bold">System:</span> Generated Prior Auth packet for Voxzogo case RX-2024-4892.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Tracker + Enrollment Pipeline */}
        <div className="flex w-full flex-col items-stretch gap-4 wide:flex-row">
          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#e5e5e5] bg-white p-6">
            <div className="flex w-full items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-2xl tracking-[-0.12px] text-[#383838]">Shipment Tracker</p>
                <StatusChip>Live Monitoring</StatusChip>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-0.5">
                  <p className="text-[32px] leading-10 tracking-[-0.32px] text-brand-teal">47</p>
                  <p className="text-[11px] text-[#4d4e50]">In Transit</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <p className="text-[32px] leading-10 tracking-[-0.32px] text-[#e9322d]">3</p>
                  <p className="text-[11px] text-[#4d4e50]">Temp Alerts</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <p className="text-[32px] leading-10 tracking-[-0.32px] text-[#11a84e]">12</p>
                  <p className="text-[11px] text-[#4d4e50]">Delivered Today</p>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3">
              {[
                { name: 'Sarah Mitchell', drug: 'Voxzogo (vosoritide)', carrier: 'FedEx Priority', eta: 'Tomorrow 10:30 AM', status: '2-8°C OK', tone: 'success' as const },
                { name: 'Marcus Chen', drug: 'Spinraza (nusinersen)', carrier: 'UPS Medical', eta: 'Today 5:00 PM', status: 'EXCURSION ALERT', tone: 'error' as const },
                { name: 'Elena Rivera', drug: 'Luxturna (voretigene)', carrier: 'FedEx Priority', eta: 'Tomorrow 2:15 PM', status: '2-8°C OK', tone: 'success' as const },
              ].map((s) => (
                <div key={s.name} className="flex w-full flex-col gap-4 rounded-lg border border-[#e2e8f0] bg-[#fefefe] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#383838]">{s.name}</p>
                      <p className="text-xs text-[#4d4e50]">{s.drug}</p>
                    </div>
                    <span
                      className={`whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-bold ${
                        s.tone === 'success' ? 'bg-[#11a84e]/10 text-[#0d8a40]' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[#4d4e50]">Carrier</p>
                      <p className="font-semibold text-[#383838]">{s.carrier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#4d4e50]">ETA</p>
                      <p className="font-semibold text-[#383838]">{s.eta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#e5e5e5] bg-white p-6">
            <div className="flex w-full items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-2xl tracking-[-0.12px] text-[#383838]">Patient Enrollment Pipeline</p>
                <StatusChip>On Track</StatusChip>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <p className="text-[32px] leading-10 tracking-[-0.32px] text-brand-teal">8</p>
                <p className="text-[11px] text-[#4d4e50]">Ready for Dispensing</p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4">
              {[
                { label: 'New Referrals', value: 23, pct: 100, conv: null },
                { label: 'Benefits Investigation', value: 18, pct: 78, conv: '78% conversion' },
                { label: 'PA Submission', value: 14, pct: 61, conv: '78% conversion' },
                { label: 'PA Approved', value: 11, pct: 48, conv: '79% conversion' },
                { label: 'Ready for Dispensing', value: 8, pct: 35, conv: null },
              ].map((row) => (
                <div key={row.label} className="flex w-full flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#383838]">{row.label}</span>
                    <span className="text-[#383838]">{row.value}</span>
                  </div>
                  <ProgressBar value={row.pct} color={TEAL} trackColor="#eaeded" height={12} />
                  {row.conv && <p className="text-xs text-[#4d4e50]">{row.conv}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Overview + Compliance */}
        <div className="flex w-full flex-col items-stretch gap-4 wide:flex-row">
          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#e5e5e5] bg-white p-6">
            <div className="flex w-full items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-2xl tracking-[-0.12px] text-[#383838]">Copay Assistance & Financial Overview</p>
                <StatusChip>Real-Time Sync</StatusChip>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <p className="text-[32px] leading-10 tracking-[-0.32px] text-brand-teal">$2.4M</p>
                <p className="text-[11px] text-[#4d4e50]">Total Claims Processed</p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-1.5 text-sm">
              <div className="flex justify-between"><span className="text-[#383838]">Insurance Reimbursements</span><span className="text-[#383838]">$1.98M</span></div>
              <div className="flex justify-between"><span className="text-[#383838]">Patient Copay Collected</span><span className="text-[#383838]">$284K</span></div>
              <div className="flex justify-between"><span className="text-[#383838]">Copay Assistance Disbursed</span><span className="text-[#383838]">$138K</span></div>
            </div>
            <div className="flex w-full flex-col gap-2.5">
              <p className="text-sm text-[#383838]">Claims Processed (Last 6 months)</p>
              <div className="flex h-[120px] w-full items-end justify-between gap-2">
                {[
                  { m: 'Jan', h: 60 },
                  { m: 'Feb', h: 70 },
                  { m: 'Mar', h: 80 },
                  { m: 'Apr', h: 90 },
                  { m: 'May', h: 100 },
                  { m: 'Jun', h: 110 },
                ].map((b, i) => (
                  <div key={b.m} className="flex flex-1 flex-col items-center gap-1.5">
                    <AnimatedBar size={b.h} color={TEAL} delay={i * 70} className="w-6 rounded-t-sm" />
                    <span className="text-xs text-[#4d4e50]">{b.m}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex w-full flex-col gap-1.5 border-t border-[#e5e5e5] pt-3 text-sm">
              <div className="flex justify-between"><span className="text-[#383838]">Active Copay Programs</span><span className="text-[#383838]">342 patients</span></div>
              <div className="flex justify-between"><span className="text-[#383838]">Utilization Rate</span><span className="text-[#383838]">94%</span></div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#e5e5e5] bg-white p-6">
            <div className="flex w-full items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-2xl tracking-[-0.12px] text-[#383838]">Compliance & REMS Alerts</p>
                <StatusChip>Audit Ready</StatusChip>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <p className="text-[32px] leading-10 tracking-[-0.32px] text-brand-teal">96</p>
                <p className="text-[11px] text-[#4d4e50]">Compliance Score</p>
              </div>
            </div>
            <div className="flex w-full justify-center py-2">
              <ProgressRing value={96} size={120} thickness={16} color={GREEN} trackColor="#eaeded">
                <span className="text-[28px] font-extrabold text-[#383838]">96</span>
                <span className="text-xs text-[#4d4e50]">Score</span>
              </ProgressRing>
            </div>
            <div className="flex w-full flex-col gap-1.5 border-t border-[#e5e5e5] pt-3 text-sm">
              <div className="flex justify-between"><span className="text-[#383838]">REMS Program Enrollments</span><span className="text-[#383838]">156 active</span></div>
              <div className="flex justify-between"><span className="text-[#383838]">Pending REMS Certifications</span><span className="text-[#383838]">4</span></div>
              <div className="flex justify-between"><span className="text-[#383838]">Adverse Event Reports (30d)</span><span className="text-[#383838]">2 filed</span></div>
              <div className="flex justify-between"><span className="text-[#383838]">Next FDA Audit</span><span className="text-[#383838]">March 2024</span></div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
