import { Fragment, useMemo, useState } from 'react'
import { ShieldCheck, Send } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import StatusChip from '@/components/ui/StatusChip'
import Donut from '@/components/ui/Donut'
import AnimatedBar from '@/components/ui/AnimatedBar'
import CaseTimeline from '@/components/ui/CaseTimeline'
import Badge, { type BadgeTone } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import SearchInput from '@/components/ui/SearchInput'
import FilterDropdown from '@/components/ui/FilterDropdown'
import Toast from '@/components/ui/Toast'
import TableActionButton from '@/components/ui/TableActionButton'

const TEAL = '#055979'
const GREEN = '#11a84e'
const ORANGE = '#e67e22'
const RED = '#e9322d'
const BLUE = '#129fea'

interface Row {
  id: string
  patient: string
  therapy: string
  carrier: string
  eta: string
  tempStatus: string
  tempTone: BadgeTone
  dispensingStatus: string
  statusTone: BadgeTone
  step: number
  detail?: 'verification' | 'consent'
}

const ROWS: Row[] = [
  { id: '1', patient: 'Sarah Mitchell', therapy: 'Voxzogo (vosoritide)', carrier: 'FedEx Priority', eta: 'Tomorrow 10:30 AM', tempStatus: '2-8°C OK', tempTone: 'success', dispensingStatus: 'Copay Confirmation Pending', statusTone: 'warning', step: 4, detail: 'verification' },
  { id: '2', patient: 'Marcus Chen', therapy: 'Spinraza (nusinersen)', carrier: 'UPS Medical', eta: 'Today 5:00 PM', tempStatus: 'EXCURSION ALERT', tempTone: 'error', dispensingStatus: 'In Transit', statusTone: 'info', step: 6 },
  { id: '3', patient: 'Elena Rivera', therapy: 'Luxturna (voretigene)', carrier: 'FedEx Priority', eta: 'Tomorrow 2:15 PM', tempStatus: '2-8°C OK', tempTone: 'success', dispensingStatus: 'Delivered', statusTone: 'success', step: 7 },
  { id: '4', patient: 'Sonia Patel', therapy: 'Alkindi Sprinkle', carrier: 'Pending Carrier', eta: 'Awaiting Consent', tempStatus: 'N/A', tempTone: 'neutral', dispensingStatus: 'Consent Pending', statusTone: 'warning', step: 4, detail: 'consent' },
]

const STATUS_OPTIONS = ['All Statuses', 'Copay Confirmation Pending', 'In Transit', 'Delivered', 'Consent Pending']
const DATE_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'All Time']

export default function DispensingHubPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(STATUS_OPTIONS[0])
  const [dateRange, setDateRange] = useState(DATE_OPTIONS[1])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [consentSent, setConsentSent] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const filteredRows = useMemo(() => {
    return ROWS.filter((row) => {
      const matchesStatus = status === 'All Statuses' || row.dispensingStatus === status
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || row.patient.toLowerCase().includes(q) || row.therapy.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [search, status])

  function requestConsent() {
    setConsentSent(true)
    setToast('Shipment consent request sent to Sonia Patel')
  }

  return (
    <AppShell active="dispensing">
      <div className="flex w-full flex-col gap-6">
        {/* Overview + Verification & Shipping Queue */}
        <div className="flex w-full flex-col items-stretch gap-4 wide:flex-row">
          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#dddddd] bg-white p-6">
            <div className="flex flex-col gap-1">
              <p className="text-2xl tracking-[-0.12px] text-[#383838]">Overview</p>
              <StatusChip>Dispensing Operations</StatusChip>
            </div>
            <div className="flex items-center gap-5">
              <Donut
                size={110}
                thickness={18}
                centerValue="849"
                centerLabel="Total Cases"
                segments={[
                  { value: 479, color: GREEN },
                  { value: 153, color: ORANGE },
                  { value: 217, color: TEAL },
                ]}
              />
              <div className="flex flex-1 flex-col gap-2">
                {[
                  { color: GREEN, label: 'Ready to Dispense', value: '479' },
                  { color: ORANGE, label: 'Pharmacist Verification', value: '153' },
                  { color: TEAL, label: 'Shipping Status', value: '217' },
                ].map((l) => (
                  <div key={l.label} className="flex w-full items-center gap-2">
                    <span className="size-3 shrink-0 rounded-full" style={{ background: l.color }} />
                    <span className="flex-1 text-sm text-[#4d4e50]">{l.label}</span>
                    <span className="text-sm text-[#383838]">{l.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#dddddd] bg-white p-6">
            <div className="flex flex-col gap-1">
              <p className="text-2xl tracking-[-0.12px] text-[#383838]">Verification &amp; Shipping Queue</p>
              <StatusChip>Live</StatusChip>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex h-[150px] flex-1 items-end justify-center gap-4">
                {[
                  { v: 153, color: ORANGE },
                  { v: 3, color: RED },
                  { v: 1, color: BLUE },
                  { v: 12, color: GREEN },
                ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span className="text-xs text-[#383838]">{b.v}</span>
                    <AnimatedBar size={Math.min(b.v, 15) * 10} color={b.color} delay={i * 80} className="w-[50px] rounded-t-md" />
                  </div>
                ))}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                {[
                  { color: ORANGE, label: 'RPh Action Required', value: '153' },
                  { color: RED, label: 'Temp Alerts', value: '3' },
                  { color: BLUE, label: 'Consent Pending', value: '1' },
                  { color: GREEN, label: 'Delivered Today', value: '12' },
                ].map((l) => (
                  <div key={l.label} className="flex w-full items-center gap-2">
                    <span className="size-3 shrink-0 rounded-full" style={{ background: l.color }} />
                    <span className="flex-1 text-sm text-[#4d4e50]">{l.label}</span>
                    <span className="text-sm text-[#383838]">{l.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Header controls */}
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <p className="text-2xl tracking-[-0.12px] text-[#383838]">Dispensing Hub</p>
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput value={search} onChange={setSearch} placeholder="Search patients, therapies..." className="w-56" />
            <FilterDropdown value={status} options={STATUS_OPTIONS} onChange={setStatus} />
            <FilterDropdown value={dateRange} options={DATE_OPTIONS} onChange={setDateRange} />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-[#e5e5e5] bg-white">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e5e5e5] bg-[#f5f5f5] text-[10px] font-bold uppercase tracking-wider text-[#666666]">
                <th className="px-6 py-3">Patient</th>
                <th className="px-3 py-3">Therapy</th>
                <th className="px-3 py-3">Carrier</th>
                <th className="px-3 py-3">ETA</th>
                <th className="px-3 py-3">Temp Status</th>
                <th className="px-3 py-3">Dispensing Status</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-[#788a95]">
                    No dispensing cases match your search or filters.
                  </td>
                </tr>
              )}
              {filteredRows.map((row) => (
                <Fragment key={row.id}>
                  <tr className="border-b border-[#f0f0f0] text-sm transition-colors hover:bg-[#f9fafb]">
                    <td className="px-6 py-3">
                      <p className="font-semibold text-[#383838]">{row.patient}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="whitespace-nowrap rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">
                        {row.therapy}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#4d4e50]">{row.carrier}</td>
                    <td className="px-3 py-3 text-[#4d4e50]">{row.eta}</td>
                    <td className="px-3 py-3">
                      <Badge tone={row.tempTone}>{row.tempStatus}</Badge>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={row.statusTone}>{row.dispensingStatus}</Badge>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <TableActionButton onClick={() => setExpanded(expanded === row.id ? null : row.id)}>View</TableActionButton>
                    </td>
                  </tr>
                  {expanded === row.id && row.detail === 'verification' && (
                    <tr>
                      <td colSpan={7} className="px-4 pb-3">
                        <div className="flex flex-col gap-3 rounded-lg border-l-4 border-[#d97706] bg-[#fffaf3] p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="flex items-center gap-2 text-sm font-bold text-[#383838]">
                              <ShieldCheck className="size-4 text-[#d97706]" />
                              Pharmacist Verification · PA Approved
                            </p>
                            <Badge tone="warning">RPh Action Required</Badge>
                          </div>
                          <div className="grid w-full grid-cols-2 gap-2 wide:grid-cols-4">
                            {[
                              { label: 'Approved Amount', value: '$2,760' },
                              { label: 'Insurance Contribution', value: '$280' },
                              { label: 'Patient Copay', value: '$2,480' },
                              { label: 'Copay Consent', value: 'Received' },
                            ].map((f) => (
                              <div key={f.label} className="rounded-lg bg-white p-3">
                                <p className="text-[10px] font-bold uppercase text-[#788a95]">{f.label}</p>
                                <p className="mt-1 text-sm font-bold text-[#383838]">{f.value}</p>
                              </div>
                            ))}
                          </div>
                          <Button size="sm" className="self-start" onClick={() => setToast('Sarah Mitchell approved for dispensing')}>
                            Approve for Dispensing
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {expanded === row.id && row.detail === 'consent' && (
                    <tr>
                      <td colSpan={7} className="px-4 pb-3">
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-sky-200 bg-sky-50/60 p-4">
                          <p className="text-sm text-[#4d4e50]">Patient consent for shipment has not yet been confirmed.</p>
                          <Button size="sm" variant={consentSent ? 'secondary' : 'primary'} onClick={requestConsent} disabled={consentSent}>
                            <Send className="size-3.5" />
                            {consentSent ? 'Consent Requested' : 'Get Consent'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={7} className="px-4 pb-3">
                      <CaseTimeline currentStep={row.step} defaultExpanded={false} />
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </AppShell>
  )
}
