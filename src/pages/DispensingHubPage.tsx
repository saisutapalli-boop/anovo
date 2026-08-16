import { Fragment, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import StatusChip from '@/components/ui/StatusChip'
import DonutLegend from '@/components/ui/DonutLegend'
import BarLegend from '@/components/ui/BarLegend'
import CaseTimeline from '@/components/ui/CaseTimeline'
import Badge, { type BadgeTone } from '@/components/ui/Badge'
import SearchInput from '@/components/ui/SearchInput'
import FilterDropdown from '@/components/ui/FilterDropdown'
import TableActionButton from '@/components/ui/TableActionButton'
import { useDispensingCase } from '@/context/DispensingCaseContext'

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
}

const BASE_ROWS: Row[] = [
  { id: '1', patient: 'Sarah Mitchell', therapy: 'Voxzogo (vosoritide)', carrier: 'FedEx Priority', eta: 'Tomorrow 10:30 AM', tempStatus: '2-8°C OK', tempTone: 'success', dispensingStatus: 'Copay Confirmation Pending', statusTone: 'warning', step: 4 },
  { id: '2', patient: 'Marcus Chen', therapy: 'Spinraza (nusinersen)', carrier: 'UPS Medical', eta: 'Today 5:00 PM', tempStatus: 'EXCURSION ALERT', tempTone: 'error', dispensingStatus: 'In Transit', statusTone: 'info', step: 6 },
  { id: '3', patient: 'Elena Rivera', therapy: 'Luxturna (voretigene)', carrier: 'FedEx Priority', eta: 'Tomorrow 2:15 PM', tempStatus: '2-8°C OK', tempTone: 'success', dispensingStatus: 'Delivered', statusTone: 'success', step: 7 },
  { id: '4', patient: 'Sonia Patel', therapy: 'Alkindi Sprinkle', carrier: 'Pending Carrier', eta: 'Awaiting Consent', tempStatus: 'N/A', tempTone: 'neutral', dispensingStatus: 'Consent Pending', statusTone: 'warning', step: 4 },
]

const STATUS_OPTIONS = [
  'All Statuses',
  'Copay Confirmation Pending',
  'Ready for Pharmacist Verification',
  'Ready to Dispense',
  'In Transit',
  'Delivered',
  'Consent Pending',
]
const DATE_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'All Time']

export default function DispensingHubPage() {
  const navigate = useNavigate()
  const { copayStatus, verificationStatus, paSimulationComplete } = useDispensingCase()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(STATUS_OPTIONS[0])
  const [dateRange, setDateRange] = useState(DATE_OPTIONS[1])

  // Sarah Mitchell's row (id '1') reflects live progress from her case detail page.
  const rows = useMemo<Row[]>(() => {
    return BASE_ROWS.map((row) => {
      if (row.id !== '1') return row
      if (verificationStatus === 'approved') {
        return { ...row, dispensingStatus: 'Ready to Dispense', statusTone: 'success', step: 7 }
      }
      if (copayStatus === 'received') {
        return { ...row, dispensingStatus: 'Ready for Pharmacist Verification', statusTone: 'info', step: 7 }
      }
      // BI & PA are already cleared once the PA simulation completes; Dispense
      // (which covers copay + pharmacist verification) becomes the active step.
      if (paSimulationComplete) {
        return { ...row, step: 7 }
      }
      return row
    })
  }, [copayStatus, verificationStatus, paSimulationComplete])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesStatus = status === 'All Statuses' || row.dispensingStatus === status
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || row.patient.toLowerCase().includes(q) || row.therapy.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [rows, search, status])

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
            <DonutLegend
              centerValue="849"
              centerLabel="Total Cases"
              items={[
                { value: 479, color: GREEN, label: 'Ready to Dispense' },
                { value: 153, color: ORANGE, label: 'Pharmacist Verification' },
                { value: 217, color: TEAL, label: 'Shipping Status' },
              ]}
            />
          </div>

          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#dddddd] bg-white p-6">
            <div className="flex flex-col gap-1">
              <p className="text-2xl tracking-[-0.12px] text-[#383838]">Verification &amp; Shipping Queue</p>
              <StatusChip>Live</StatusChip>
            </div>
            <BarLegend
              containerClassName="flex h-[150px] flex-1 items-end justify-center gap-4"
              barClassName="w-[50px] rounded-t-md"
              showValues
              bars={[
                { size: 150, color: ORANGE, label: 'RPh Action Required', value: '153' },
                { size: 30, color: RED, label: 'Temp Alerts', value: '3' },
                { size: 15, color: BLUE, label: 'Consent Pending', value: '1' },
                { size: 90, color: GREEN, label: 'Delivered Today', value: '12' },
              ]}
            />
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
                      <TableActionButton onClick={() => navigate(`/dispensing/${row.id}`)}>View</TableActionButton>
                    </td>
                  </tr>
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
    </AppShell>
  )
}
