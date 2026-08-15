import { Fragment, useMemo, useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import StatusChip from '@/components/ui/StatusChip'
import Donut from '@/components/ui/Donut'
import ProgressBar from '@/components/ui/ProgressBar'
import CaseTimeline from '@/components/ui/CaseTimeline'
import SearchInput from '@/components/ui/SearchInput'
import FilterDropdown from '@/components/ui/FilterDropdown'
import TableActionButton from '@/components/ui/TableActionButton'

const TEAL = '#055979'
const GREEN = '#11a84e'
const ORANGE = '#e67e22'
const BLUE = '#129fea'

interface Row {
  id: string
  name: string
  refId: string
  therapy: string
  payer: string
  copay: string
  paStatus: string
  paTone: 'neutral' | 'error' | 'success'
  finAid: string
  lastAction: string
  step: number
}

const ROWS: Row[] = [
  { id: '1', name: 'Sarah Mitchell', refId: 'ARX-1824-3842', therapy: 'Rajerion LXR', payer: 'Aetna PPO', copay: '-$660', paStatus: 'Not Submitted', paTone: 'neutral', finAid: 'Not resolved', lastAction: 'PA In progress', step: 5 },
  { id: '2', name: 'Michael Smith', refId: 'ARX-2816-8841', therapy: 'Infusita', payer: 'BlueCross PPO', copay: '$0 (PAP)', paStatus: 'Denied', paTone: 'error', finAid: '✓ Resolved', lastAction: 'Oct 24, 2024', step: 6 },
  { id: '3', name: 'Sonia Patel', refId: 'ARX-1816-0952', therapy: 'Altirel Sprinkle', payer: 'UMC Choice', copay: '$120', paStatus: 'Approved', paTone: 'success', finAid: '✓ Resolved', lastAction: 'Oct 23, 2024', step: 7 },
]

const STATUS_OPTIONS = ['All Statuses', 'Not Submitted', 'Denied', 'Approved']
const DATE_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'All Time']

export default function PriorAuthorizationListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(STATUS_OPTIONS[0])
  const [dateRange, setDateRange] = useState(DATE_OPTIONS[1])

  const filteredRows = useMemo(() => {
    return ROWS.filter((row) => {
      const matchesStatus = status === 'All Statuses' || row.paStatus === status
      const q = search.trim().toLowerCase()
      const matchesSearch =
        !q || row.name.toLowerCase().includes(q) || row.refId.toLowerCase().includes(q) || row.therapy.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [status, search])

  return (
    <AppShell active="prior-authorization">
      <div className="flex w-full flex-col gap-6">
        {/* Top row: Overview, Pipeline, Payer Intelligence */}
        <div className="flex w-full flex-col items-stretch gap-4 wide:flex-row">
          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#dddddd] bg-white p-6">
            <div className="flex flex-col gap-1">
              <p className="text-2xl tracking-[-0.12px] text-[#383838]">Overview</p>
              <StatusChip>Benefit Investigation / Prior Authorization</StatusChip>
            </div>
            <div className="flex items-center gap-4">
              <Donut
                size={110}
                thickness={18}
                centerValue="40"
                centerLabel="Total Cases"
                segments={[
                  { value: 18, color: TEAL },
                  { value: 11, color: GREEN },
                  { value: 3, color: '#e9322d' },
                  { value: 8, color: BLUE },
                ]}
              />
              <div className="flex flex-1 flex-col gap-2">
                {[
                  { color: TEAL, label: 'In My Queue', value: '18' },
                  { color: GREEN, label: 'PA Pending', value: '11' },
                  { color: '#e9322d', label: 'PA Denied', value: '3' },
                  { color: BLUE, label: 'Cleared Today', value: '8' },
                ].map((l) => (
                  <div key={l.label} className="flex w-full items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: l.color }} />
                    <span className="flex-1 text-sm text-[#4d4e50]">{l.label}</span>
                    <span className="text-sm text-[#383838]">{l.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#dddddd] bg-white p-6">
            <p className="text-2xl tracking-[-0.12px] text-[#383838]">PA Pipeline - Today</p>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Aetna PPO · Signifor LAR', status: 'Day 8 (60%)', pct: 60, color: TEAL },
                { label: 'BlueCross · Isturisa', status: 'Denied (100%)', pct: 100, color: '#e9322d' },
                { label: 'UHC · Alkindi Sprinkle', status: 'Approved (100%)', pct: 100, color: GREEN },
                { label: 'Cigna · Signifor LAR', status: 'Day 3 (25%)', pct: 25, color: ORANGE },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#383838]">{row.label}</span>
                    <span className="text-[#4d4e50]">{row.status}</span>
                  </div>
                  <ProgressBar value={row.pct} color={row.color} trackColor="#eaeded" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#dddddd] bg-white p-6">
            <p className="text-2xl tracking-[-0.12px] text-[#383838]">Payer Intelligence</p>
            <div className="flex flex-col gap-3">
              <div className="rounded-lg bg-[#f5f5f5] p-4">
                <p className="mb-1.5 text-sm font-bold text-[#383838]">Aetna PPO</p>
                <p className="text-xs leading-relaxed text-[#666666]">
                  Specialty Tier 4 requires prior auth. Automated simulation tracks complete diagnosis check with
                  92% SLA success.
                </p>
              </div>
              <div className="rounded-lg bg-[#f5f5f5] p-4">
                <p className="mb-1.5 text-sm font-bold text-[#383838]">BlueCross PPO</p>
                <p className="text-xs leading-relaxed text-[#666666]">
                  Step therapy required for Isturisa. Appeal engine indicates a 74% historic approval rate on
                  second-level appeal submission.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header controls */}
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <p className="text-2xl tracking-[-0.12px] text-[#383838]">Prior Authorization</p>
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput value={search} onChange={setSearch} placeholder="Search patients, cases..." className="w-56" />
            <FilterDropdown value={status} options={STATUS_OPTIONS} onChange={setStatus} />
            <FilterDropdown value={dateRange} options={DATE_OPTIONS} onChange={setDateRange} />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-[#e5e5e5] bg-white">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e5e5e5] bg-[#f5f5f5] text-[10px] font-bold uppercase tracking-wider text-[#666666]">
                <th className="px-6 py-3">Patient</th>
                <th className="px-3 py-3">Therapy</th>
                <th className="px-3 py-3">Payer</th>
                <th className="px-3 py-3">Est. Copay</th>
                <th className="px-3 py-3">PA Status</th>
                <th className="px-3 py-3">Fin. Aid</th>
                <th className="px-3 py-3">Last Action</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-[#788a95]">
                    No prior authorization cases match your search or filters.
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
                    <td className="px-3 py-3 text-[#4d4e50]">{row.payer}</td>
                    <td className="px-3 py-3 text-[#4d4e50]">{row.copay}</td>
                    <td className="px-3 py-3">
                      {row.paTone === 'neutral' ? (
                        <span className="text-xs font-semibold text-[#666666]">{row.paStatus}</span>
                      ) : (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            row.paTone === 'error' ? 'bg-rose-100 text-rose-700' : 'bg-[#11a84e]/10 text-[#0d8a40]'
                          }`}
                        >
                          {row.paStatus}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-[#4d4e50]">{row.finAid}</td>
                    <td className="px-3 py-3 text-[#4d4e50]">{row.lastAction}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TableActionButton onClick={() => navigate(`/prior-authorization/${row.id}`)}>View</TableActionButton>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={8} className="px-4 pb-3">
                      <CaseTimeline currentStep={row.step} defaultExpanded={false} />
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex w-full items-center justify-between text-xs text-[#788a95]">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="size-3.5" /> Showing {filteredRows.length} of 245 active cases
          </span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-[#dddddd] px-3 py-1.5 font-semibold text-[#4d4e50] transition-colors hover:bg-[#f5f5f5]">
              Previous
            </button>
            <button className="rounded-lg bg-brand-teal px-3 py-1.5 font-semibold text-white">1</button>
            <button className="rounded-lg border border-[#dddddd] px-3 py-1.5 font-semibold text-[#4d4e50] transition-colors hover:bg-[#f5f5f5]">
              2
            </button>
            <button className="rounded-lg border border-[#dddddd] px-3 py-1.5 font-semibold text-[#4d4e50] transition-colors hover:bg-[#f5f5f5]">
              Next
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
