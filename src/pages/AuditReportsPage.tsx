import { useState } from 'react'
import { History, FileText, Download } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import Button from '@/components/ui/Button'
import FilterDropdown from '@/components/ui/FilterDropdown'
import StatusChip from '@/components/ui/StatusChip'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'

const REPORT_TYPES = ['Referral Intake Summary', 'Prior Authorization Outcomes', 'Dispensing & Cold-Chain', 'Compliance & REMS']
const DATE_RANGES = ['Last 7 Days', 'Last 30 Days', 'Last Quarter', 'Year to Date']

interface GeneratedReport {
  id: string
  name: string
  range: string
  generatedAt: string
}

const AUDIT_LOG = [
  { actor: 'System', initials: 'FG', tone: 'neutral' as const, text: 'Ingested inbound PDF for Sarah Mitchell', meta: 'Today, 9:04 AM · Event: IntakeDocumentProcessed' },
  { actor: 'System Automator', initials: 'AI', tone: 'brand' as const, text: 'Extracted 9 fields (2 flagged for review)', meta: 'Today, 9:04 AM · OCR Engine v2.1' },
  { actor: 'Alex Morgan', initials: 'AM', tone: 'accent' as const, text: 'Executed NPI verification for Dr. Robert Smith', meta: 'Today, 9:12 AM · NPPES Registry Verified' },
  { actor: 'System', initials: 'PA', tone: 'neutral' as const, text: 'Submitted ePA request to Aetna for Signifor LAR', meta: 'Today, 9:20 AM · Payer Gateway v3' },
  { actor: 'Jordan Wells', initials: 'JW', tone: 'accent' as const, text: 'Approved benefit investigation for Michael Smith', meta: 'Today, 8:55 AM · BI Queue' },
  { actor: 'System', initials: 'CC', tone: 'neutral' as const, text: 'Cold-chain excursion alert raised for Marcus Chen shipment', meta: 'Today, 8:41 AM · Shipment Monitor' },
]

export default function AuditReportsPage() {
  const [reportType, setReportType] = useState(REPORT_TYPES[0])
  const [dateRange, setDateRange] = useState(DATE_RANGES[1])
  const [reports, setReports] = useState<GeneratedReport[]>([
    { id: '1', name: 'Referral Intake Summary', range: 'Last 30 Days', generatedAt: 'Aug 12, 2026' },
    { id: '2', name: 'Compliance & REMS', range: 'Last Quarter', generatedAt: 'Jul 30, 2026' },
  ])
  const [generating, setGenerating] = useState(false)
  const { toast, showToast, clearToast } = useToast()

  function generateReport() {
    setGenerating(true)
    setTimeout(() => {
      setReports((prev) => [{ id: String(Date.now()), name: reportType, range: dateRange, generatedAt: 'Just now' }, ...prev])
      setGenerating(false)
      showToast(`${reportType} report generated`, 'success')
    }, 900)
  }

  return (
    <AppShell active="audit">
      <div className="flex w-full flex-col gap-6">
        <div>
          <p className="text-2xl tracking-[-0.12px] text-[#383838]">Audit &amp; Reports</p>
          <p className="text-sm text-[#666666]">Real-time platform activity and downloadable compliance reports</p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 wide:grid-cols-[1.2fr_1fr]">
          <div className="flex w-full flex-col gap-4 rounded-xl border border-[#e2e8f0] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-3">
              <p className="flex items-center gap-2 text-base font-bold text-[#383838]">
                <History className="size-4 text-brand-green" />
                Real-Time Audit Trail
              </p>
              <StatusChip>Stream Active</StatusChip>
            </div>
            <div className="flex flex-col gap-4">
              {AUDIT_LOG.map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      entry.tone === 'brand'
                        ? 'bg-brand-teal/10 text-brand-teal'
                        : entry.tone === 'accent'
                          ? 'bg-brand-green text-white'
                          : 'bg-[#f5f5f5] text-[#4d4e50]'
                    }`}
                  >
                    {entry.initials}
                  </div>
                  <div>
                    <p className="text-sm text-[#4d4e50]">
                      <span className="font-bold text-[#383838]">{entry.actor}</span> {entry.text}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-[#788a95]">{entry.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 rounded-xl border border-[#e2e8f0] bg-white p-6">
            <p className="text-base font-bold text-[#383838]">Generate Report</p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#383838]">Report Type</label>
              <FilterDropdown value={reportType} options={REPORT_TYPES} onChange={setReportType} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#383838]">Date Range</label>
              <FilterDropdown value={dateRange} options={DATE_RANGES} onChange={setDateRange} />
            </div>
            <Button onClick={generateReport} disabled={generating} className="self-start">
              <FileText className="size-4" />
              {generating ? 'Generating...' : 'Generate Report'}
            </Button>

            <div className="flex flex-col gap-2 border-t border-[#f0f0f0] pt-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#666666]">Recent Reports</p>
              {reports.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#f5f5f5] px-3.5 py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-[#383838]">{r.name}</p>
                    <p className="text-xs text-[#788a95]">
                      {r.range} &middot; {r.generatedAt}
                    </p>
                  </div>
                  <button
                    onClick={() => showToast(`Downloading ${r.name}...`, 'neutral')}
                    className="rounded-lg p-1.5 text-[#788a95] transition-colors hover:bg-white hover:text-brand-teal"
                    aria-label={`Download ${r.name}`}
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} tone={toast.tone} onDone={clearToast} />}
    </AppShell>
  )
}
