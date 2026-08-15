import { useMemo, useState } from 'react'
import { ClipboardList, Plus } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import Badge, { type BadgeTone } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import SearchInput from '@/components/ui/SearchInput'
import FilterDropdown from '@/components/ui/FilterDropdown'
import SidePanel from '@/components/ui/SidePanel'
import Toast from '@/components/ui/Toast'
import TableActionButton from '@/components/ui/TableActionButton'

type AssessmentStatus = 'Not Started' | 'In Progress' | 'Pending Review' | 'Completed'

interface Assessment {
  id: string
  patient: string
  therapy: string
  type: string
  status: AssessmentStatus
  dueDate: string
}

const STATUS_TONE: Record<AssessmentStatus, BadgeTone> = {
  'Not Started': 'neutral',
  'In Progress': 'info',
  'Pending Review': 'warning',
  Completed: 'success',
}

const INITIAL: Assessment[] = [
  { id: '1', patient: 'Sarah Mitchell', therapy: 'Voxzogo (vosoritide)', type: 'Baseline Enzyme Assessment', status: 'Pending Review', dueDate: 'Aug 16, 2026' },
  { id: '2', patient: 'Sarah Mitchell', therapy: 'Voxzogo (vosoritide)', type: 'Genetic Diagnostic Review', status: 'In Progress', dueDate: 'Aug 18, 2026' },
  { id: '3', patient: 'Marcus Chen', therapy: 'Spinraza (nusinersen)', type: 'Neurological Imaging Review', status: 'Not Started', dueDate: 'Aug 20, 2026' },
  { id: '4', patient: 'Elena Rivera', therapy: 'Luxturna (voretigene)', type: '12-Month Treatment History', status: 'Completed', dueDate: 'Aug 10, 2026' },
  { id: '5', patient: 'Priya Nair', therapy: 'Alkindi Sprinkle', type: 'Medical Necessity Review', status: 'Not Started', dueDate: 'Aug 22, 2026' },
]

const STATUS_OPTIONS = ['All Statuses', 'Not Started', 'In Progress', 'Pending Review', 'Completed']

export default function ClinicalAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(STATUS_OPTIONS[0])
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [newPatient, setNewPatient] = useState('')
  const [newType, setNewType] = useState('')
  const [newDue, setNewDue] = useState('')

  const filtered = useMemo(() => {
    return assessments.filter((a) => {
      const matchesStatus = status === 'All Statuses' || a.status === status
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || a.patient.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [assessments, search, status])

  function advanceStatus(id: string) {
    const order: AssessmentStatus[] = ['Not Started', 'In Progress', 'Pending Review', 'Completed']
    setAssessments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a
        const nextIndex = Math.min(order.indexOf(a.status) + 1, order.length - 1)
        return { ...a, status: order[nextIndex] }
      }),
    )
  }

  function createAssessment(e: React.FormEvent) {
    e.preventDefault()
    if (!newPatient.trim() || !newType.trim()) return
    setAssessments((prev) => [
      { id: String(Date.now()), patient: newPatient.trim(), therapy: 'Unassigned', type: newType.trim(), status: 'Not Started', dueDate: newDue || 'Unscheduled' },
      ...prev,
    ])
    setCreating(false)
    setNewPatient('')
    setNewType('')
    setNewDue('')
    setToast('Clinical assessment created')
  }

  return (
    <AppShell active="clinical">
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-2xl tracking-[-0.12px] text-[#383838]">Clinical Assessments</p>
            <p className="text-sm text-[#666666]">Rare-disease clinical review tasks awaiting completion</p>
          </div>
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" />
            New Assessment
          </Button>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search patient or assessment type..." className="w-64" />
          <FilterDropdown value={status} options={STATUS_OPTIONS} onChange={setStatus} />
        </div>

        <div className="grid w-full grid-cols-1 gap-4 wide:grid-cols-2">
          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-[#788a95]">
              No clinical assessments match your search or filters.
            </p>
          )}
          {filtered.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-3 rounded-xl border border-[#dddddd] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-teal/30 hover:shadow-[0_8px_24px_rgba(0,89,115,0.08)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-teal/10">
                    <ClipboardList className="size-5 text-brand-teal" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#383838]">{a.type}</p>
                    <p className="text-xs text-[#666666]">
                      {a.patient} &middot; {a.therapy}
                    </p>
                  </div>
                </div>
                <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
              </div>
              <div className="flex items-center justify-between border-t border-[#f0f0f0] pt-3 text-xs text-[#788a95]">
                <span>Due {a.dueDate}</span>
                {a.status !== 'Completed' && (
                  <TableActionButton onClick={() => advanceStatus(a.id)}>
                    {a.status === 'Not Started' ? 'Start' : a.status === 'In Progress' ? 'Submit for Review' : 'Mark Complete'}
                  </TableActionButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {creating && (
        <SidePanel
          title="New Assessment"
          onClose={() => setCreating(false)}
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setCreating(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={createAssessment}>
                Create Assessment
              </Button>
            </>
          }
        >
          <form onSubmit={createAssessment} className="flex flex-col gap-4">
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
              <label className="text-[13px] font-semibold text-[#383838]">Assessment Type</label>
              <input
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                required
                placeholder="e.g. Baseline Enzyme Assessment"
                className="w-full rounded-lg border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#383838] outline-none focus:border-brand-teal focus:shadow-[0_0_0_3px_rgba(0,89,115,0.12)]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#383838]">Due Date</label>
              <input
                value={newDue}
                onChange={(e) => setNewDue(e.target.value)}
                placeholder="e.g. Aug 30, 2026"
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
