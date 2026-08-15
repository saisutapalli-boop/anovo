import { Fragment, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import StatusChip from '@/components/ui/StatusChip'
import DonutLegend from '@/components/ui/DonutLegend'
import CaseTimeline from '@/components/ui/CaseTimeline'
import BarLegend from '@/components/ui/BarLegend'
import SearchInput from '@/components/ui/SearchInput'
import FilterDropdown from '@/components/ui/FilterDropdown'
import TableActionButton from '@/components/ui/TableActionButton'

const TEAL = '#055979'
const GREEN = '#11a84e'
const ORANGE = '#e67e22'
const RED = '#e9322d'

interface Row {
  id: string
  name: string
  refId: string
  therapy: string
  source: string
  received: string
  duplicate: string
  duplicateWarn?: boolean
  status: string
  statusColor: string
  step: number
}

const ROWS: Row[] = [
  { id: '1', name: 'Sarah Mitchell', refId: 'REF-1984-SM01', therapy: 'SignaFor LXR', source: 'Fax', received: '9m ago', duplicate: '✓ No match', status: 'OCR Review', statusColor: '#b45309', step: 2 },
  { id: '2', name: 'Sarah Mitchell', refId: 'REF-2036-1042', therapy: 'SignaFor LXR', source: 'Fax', received: '4m ago', duplicate: '✓ No match', status: 'OCR Review', statusColor: '#b45309', step: 1 },
  { id: '3', name: 'Sarah Mitchell', refId: 'REF-1984-SM01', therapy: 'SignaFor LXR', source: 'Phone', received: '2h ago', duplicate: '✓ No match', status: 'On Hold', statusColor: '#4d4e50', step: 2 },
  { id: '4', name: 'James Ortega', refId: 'REF-1984-JO02', therapy: 'Marbol', source: 'e-Rx', received: '43m ago', duplicate: '✓ No match', status: 'Auto-Created', statusColor: '#0d8a40', step: 4 },
  { id: '5', name: 'Priya Nair', refId: 'REF-1984-PN03', therapy: 'Abrexil Sprinkle', source: 'Phone', received: '1h 5m ago', duplicate: '⚠ Review DOB', duplicateWarn: true, status: 'In Progress', statusColor: '#129fea', step: 3 },
]

const STATUS_OPTIONS = ['All Statuses', 'OCR Review', 'On Hold', 'Auto-Created', 'In Progress']
const DATE_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'All Time']

export default function ReferralIntakeListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(STATUS_OPTIONS[0])
  const [dateRange, setDateRange] = useState(DATE_OPTIONS[1])

  const filteredRows = useMemo(() => {
    return ROWS.filter((row) => {
      const matchesStatus = status === 'All Statuses' || row.status === status
      const q = search.trim().toLowerCase()
      const matchesSearch =
        !q || row.name.toLowerCase().includes(q) || row.refId.toLowerCase().includes(q) || row.therapy.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [status, search])

  return (
    <AppShell active="referral-intake">
      <div className="flex w-full flex-col gap-6">
        {/* Overview + Queue Health */}
        <div className="flex w-full flex-col items-stretch gap-4 wide:flex-row">
          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#dddddd] bg-white p-6">
            <div className="flex flex-col gap-1">
              <p className="text-2xl tracking-[-0.12px] text-[#383838]">Overview</p>
              <StatusChip>Referral Intake</StatusChip>
            </div>
            <DonutLegend
              centerValue="72"
              centerLabel="Total Cases"
              items={[
                { value: 47, color: TEAL, label: "Today's Inbound" },
                { value: 12, color: GREEN, label: 'Pending Review' },
                { value: 4, color: ORANGE, label: 'Duplicates Blocked' },
                { value: 9, color: '#129fea', label: 'Ready for BI' },
              ]}
            />
          </div>

          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#dddddd] bg-white p-6">
            <div className="flex flex-col gap-1">
              <p className="text-2xl tracking-[-0.12px] text-[#383838]">Queue Health & Next Actions</p>
              <StatusChip>Live</StatusChip>
            </div>
            <BarLegend
              containerClassName="flex h-[150px] flex-1 items-end justify-center gap-4"
              barClassName="w-[50px] rounded-t-md"
              showValues
              bars={[
                { size: 110, color: TEAL, label: 'Avg. Resolution', value: '11' },
                { size: 30, color: RED, label: 'Waiting on Input', value: '3' },
                { size: 20, color: ORANGE, label: 'SLA at Risk', value: '2' },
                { size: 90, color: GREEN, label: 'Ready for BI', value: '9' },
              ]}
            />
          </div>
        </div>

        {/* Header controls */}
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <p className="text-2xl tracking-[-0.12px] text-[#383838]">Referral Intakes</p>
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput value={search} onChange={setSearch} placeholder="Search patients, cases..." className="w-56" />
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
                <th className="px-3 py-3">Source</th>
                <th className="px-3 py-3">Received</th>
                <th className="px-3 py-3">Duplicate</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-[#788a95]">
                    No referral intakes match your search or filters.
                  </td>
                </tr>
              )}
              {filteredRows.map((row) => (
                <Fragment key={row.id}>
                  <tr className="border-b border-[#f0f0f0] text-sm transition-colors hover:bg-[#f9fafb]">
                    <td className="px-6 py-3">
                      <p className="font-semibold text-[#383838]">{row.name}</p>
                      <p className="font-mono text-[10px] text-[#788a95]">{row.refId}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="whitespace-nowrap rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">
                        {row.therapy}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#4d4e50]">{row.source}</td>
                    <td className="px-3 py-3 text-[#4d4e50]">{row.received}</td>
                    <td className="px-3 py-3">
                      {row.duplicateWarn ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                          {row.duplicate}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-[#0d8a40]">{row.duplicate}</span>
                      )}
                    </td>
                    <td className="px-3 py-3 font-semibold" style={{ color: row.statusColor }}>
                      {row.status}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TableActionButton onClick={() => navigate(`/referral-intake/${row.id}`)}>Review</TableActionButton>
                      </div>
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
