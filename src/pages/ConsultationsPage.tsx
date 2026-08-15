import { useMemo, useState } from 'react'
import { CalendarPlus, MessageCircle } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import Badge, { type BadgeTone } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import SearchInput from '@/components/ui/SearchInput'
import FilterDropdown from '@/components/ui/FilterDropdown'
import SidePanel from '@/components/ui/SidePanel'
import Toast from '@/components/ui/Toast'
import TableActionButton from '@/components/ui/TableActionButton'

type ConsultStatus = 'Requested' | 'Scheduled' | 'Completed' | 'Declined'

interface Consultation {
  id: string
  patient: string
  requestedBy: string
  topic: string
  status: ConsultStatus
  when: string
}

const STATUS_TONE: Record<ConsultStatus, BadgeTone> = {
  Requested: 'warning',
  Scheduled: 'info',
  Completed: 'success',
  Declined: 'error',
}

const INITIAL: Consultation[] = [
  { id: '1', patient: 'Sarah Mitchell', requestedBy: 'Dr. James Carter', topic: 'REMS enrollment walkthrough', status: 'Requested', when: 'Requested 2h ago' },
  { id: '2', patient: 'Marcus Chen', requestedBy: 'Jordan Wells, BI', topic: 'Cold-chain excursion review', status: 'Scheduled', when: 'Aug 15, 2026 · 2:00 PM' },
  { id: '3', patient: 'Elena Rivera', requestedBy: 'Pharmacist Team', topic: 'Post-dispensing adherence check-in', status: 'Completed', when: 'Aug 11, 2026 · 10:00 AM' },
  { id: '4', patient: 'Priya Nair', requestedBy: 'Dr. Robert Chen', topic: 'Alkindi Sprinkle dosing question', status: 'Requested', when: 'Requested 40m ago' },
]

const STATUS_OPTIONS = ['All Statuses', 'Requested', 'Scheduled', 'Completed', 'Declined']

export default function ConsultationsPage() {
  const [consults, setConsults] = useState<Consultation[]>(INITIAL)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(STATUS_OPTIONS[0])
  const [scheduling, setScheduling] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [newPatient, setNewPatient] = useState('')
  const [newTopic, setNewTopic] = useState('')
  const [newWith, setNewWith] = useState('')

  const filtered = useMemo(() => {
    return consults.filter((c) => {
      const matchesStatus = status === 'All Statuses' || c.status === status
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || c.patient.toLowerCase().includes(q) || c.topic.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [consults, search, status])

  function setConsultStatus(id: string, next: ConsultStatus) {
    setConsults((prev) => prev.map((c) => (c.id === id ? { ...c, status: next } : c)))
    setToast(`Consultation ${next.toLowerCase()}`)
  }

  function scheduleNew(e: React.FormEvent) {
    e.preventDefault()
    if (!newPatient.trim() || !newTopic.trim()) return
    setConsults((prev) => [
      { id: String(Date.now()), patient: newPatient.trim(), requestedBy: newWith.trim() || 'Alex Morgan', topic: newTopic.trim(), status: 'Scheduled', when: 'Just scheduled' },
      ...prev,
    ])
    setScheduling(false)
    setNewPatient('')
    setNewTopic('')
    setNewWith('')
    setToast('Consultation scheduled')
  }

  return (
    <AppShell active="consultations">
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-2xl tracking-[-0.12px] text-[#383838]">Consultations</p>
            <p className="text-sm text-[#666666]">Patient and provider consultation requests across the care team</p>
          </div>
          <Button onClick={() => setScheduling(true)}>
            <CalendarPlus className="size-4" />
            Schedule Consultation
          </Button>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search patient or topic..." className="w-64" />
          <FilterDropdown value={status} options={STATUS_OPTIONS} onChange={setStatus} />
        </div>

        <div className="flex w-full flex-col gap-3">
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-[#788a95]">No consultations match your search or filters.</p>
          )}
          {filtered.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#dddddd] bg-white p-5 transition-colors hover:border-brand-teal/30"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-teal/10">
                  <MessageCircle className="size-5 text-brand-teal" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#383838]">{c.topic}</p>
                  <p className="text-xs text-[#666666]">
                    {c.patient} &middot; requested by {c.requestedBy}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#788a95]">{c.when}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>
                {c.status === 'Requested' && (
                  <>
                    <TableActionButton onClick={() => setConsultStatus(c.id, 'Scheduled')}>Accept</TableActionButton>
                    <TableActionButton variant="secondary" onClick={() => setConsultStatus(c.id, 'Declined')}>
                      Decline
                    </TableActionButton>
                  </>
                )}
                {c.status === 'Scheduled' && (
                  <TableActionButton onClick={() => setConsultStatus(c.id, 'Completed')}>Mark Complete</TableActionButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {scheduling && (
        <SidePanel
          title="Schedule Consultation"
          onClose={() => setScheduling(false)}
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setScheduling(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={scheduleNew}>
                Schedule
              </Button>
            </>
          }
        >
          <form onSubmit={scheduleNew} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#383838]">Patient</label>
              <input
                value={newPatient}
                onChange={(e) => setNewPatient(e.target.value)}
                required
                className="w-full rounded-lg border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#383838] outline-none focus:border-brand-teal focus:shadow-[0_0_0_3px_rgba(0,89,115,0.12)]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#383838]">Topic</label>
              <input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                required
                placeholder="e.g. REMS enrollment walkthrough"
                className="w-full rounded-lg border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#383838] outline-none focus:border-brand-teal focus:shadow-[0_0_0_3px_rgba(0,89,115,0.12)]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#383838]">With</label>
              <input
                value={newWith}
                onChange={(e) => setNewWith(e.target.value)}
                placeholder="e.g. Dr. James Carter"
                className="w-full rounded-lg border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#383838] outline-none focus:border-brand-teal focus:shadow-[0_0_0_3px_rgba(0,89,115,0.12)]"
              />
            </div>
          </form>
        </SidePanel>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </AppShell>
  )
}
