import { useMemo, useState } from 'react'
import { UserPlus, MoreVertical, Check } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import SearchInput from '@/components/ui/SearchInput'
import FilterDropdown from '@/components/ui/FilterDropdown'
import SidePanel from '@/components/ui/SidePanel'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'

type Role = 'Super Admin' | 'Intake Coordinator' | 'Benefit Investigator' | 'Pharmacist' | 'Auditor'
type Status = 'Active' | 'Invited' | 'Suspended'

interface AppUser {
  id: string
  name: string
  email: string
  role: Role
  status: Status
  lastActive: string
}

const ROLES: Role[] = ['Super Admin', 'Intake Coordinator', 'Benefit Investigator', 'Pharmacist', 'Auditor']

const INITIAL_USERS: AppUser[] = [
  { id: '1', name: 'Alex Morgan', email: 'alex.morgan@anovorx.com', role: 'Super Admin', status: 'Active', lastActive: 'Just now' },
  { id: '2', name: 'Jordan Wells', email: 'jordan.wells@anovorx.com', role: 'Benefit Investigator', status: 'Active', lastActive: '12m ago' },
  { id: '3', name: 'Priya Nair', email: 'priya.nair@anovorx.com', role: 'Intake Coordinator', status: 'Active', lastActive: '1h ago' },
  { id: '4', name: 'Marcus Chen', email: 'marcus.chen@anovorx.com', role: 'Pharmacist', status: 'Active', lastActive: 'Yesterday' },
  { id: '5', name: 'Elena Rivera', email: 'elena.rivera@anovorx.com', role: 'Auditor', status: 'Invited', lastActive: 'Never' },
  { id: '6', name: 'Sam Whitfield', email: 'sam.whitfield@anovorx.com', role: 'Intake Coordinator', status: 'Suspended', lastActive: '14d ago' },
]

const STATUS_TONE: Record<Status, 'success' | 'info' | 'error'> = {
  Active: 'success',
  Invited: 'info',
  Suspended: 'error',
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [inviting, setInviting] = useState(false)
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const { toast, showToast, clearToast } = useToast()

  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<Role>('Intake Coordinator')

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === 'All Roles' || u.role === roleFilter
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      return matchesRole && matchesSearch
    })
  }, [users, search, roleFilter])

  function sendInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) return
    const user: AppUser = {
      id: String(Date.now()),
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'Invited',
      lastActive: 'Never',
    }
    setUsers((prev) => [user, ...prev])
    setInviting(false)
    setInviteName('')
    setInviteEmail('')
    setInviteRole('Intake Coordinator')
    showToast(`Invitation sent to ${user.email}`, 'success')
  }

  function toggleSuspend(user: AppUser) {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: u.status === 'Suspended' ? 'Active' : 'Suspended' } : u)),
    )
    setMenuFor(null)
    showToast(user.status === 'Suspended' ? `${user.name} reactivated` : `${user.name} suspended`, user.status === 'Suspended' ? 'success' : 'warning')
  }

  function removeUser(user: AppUser) {
    setUsers((prev) => prev.filter((u) => u.id !== user.id))
    setMenuFor(null)
    showToast(`${user.name} removed from workspace`, 'warning')
  }

  return (
    <AppShell active="users">
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-2xl tracking-[-0.12px] text-[#383838]">User Management</p>
            <p className="text-sm text-[#666666]">{users.length} team members across the Specialty Rx Hub platform</p>
          </div>
          <Button onClick={() => setInviting(true)}>
            <UserPlus className="size-4" />
            Invite User
          </Button>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email..." className="w-64" />
          <FilterDropdown value={roleFilter} options={['All Roles', ...ROLES]} onChange={setRoleFilter} />
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-[#e5e5e5] bg-white">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e5e5e5] bg-[#f5f5f5] text-[10px] font-bold uppercase tracking-wider text-[#666666]">
                <th className="px-6 py-3">User</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Last Active</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-[#788a95]">
                    No users match your search or filters.
                  </td>
                </tr>
              )}
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#f0f0f0] text-sm transition-colors last:border-b-0 hover:bg-[#f9fafb]">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-teal text-xs font-bold text-white">
                        {initials(user.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#383838]">{user.name}</p>
                        <p className="text-xs text-[#788a95]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[#4d4e50]">{user.role}</td>
                  <td className="px-3 py-3">
                    <Badge tone={STATUS_TONE[user.status]}>{user.status}</Badge>
                  </td>
                  <td className="px-3 py-3 text-[#4d4e50]">{user.lastActive}</td>
                  <td className="px-3 py-3 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setMenuFor(menuFor === user.id ? null : user.id)}
                        className="rounded-lg p-1.5 text-[#788a95] transition-colors hover:bg-[#f5f5f5] hover:text-[#383838]"
                        aria-label={`Actions for ${user.name}`}
                      >
                        <MoreVertical className="size-4" />
                      </button>
                      {menuFor === user.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                          <div className="absolute right-0 top-full z-20 mt-1 w-40 animate-fade-in rounded-lg border border-[#e5e5e5] bg-white p-1.5 text-left shadow-lg">
                            <button
                              onClick={() => toggleSuspend(user)}
                              className="w-full rounded-md px-2.5 py-2 text-left text-xs font-semibold text-[#383838] transition-colors hover:bg-[#f5f5f5]"
                            >
                              {user.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                            </button>
                            <button
                              onClick={() => removeUser(user)}
                              className="w-full rounded-md px-2.5 py-2 text-left text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                            >
                              Remove
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {inviting && (
        <SidePanel
          title="Invite User"
          onClose={() => setInviting(false)}
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setInviting(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={sendInvite}>
                Send Invite
              </Button>
            </>
          }
        >
          <form onSubmit={sendInvite} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#383838]">Full Name</label>
              <input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                required
                className="w-full rounded-lg border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#383838] outline-none focus:border-brand-teal focus:shadow-[0_0_0_3px_rgba(0,89,115,0.12)]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#383838]">Email Address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#383838] outline-none focus:border-brand-teal focus:shadow-[0_0_0_3px_rgba(0,89,115,0.12)]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#383838]">Role</label>
              <div className="flex flex-col gap-1.5">
                {ROLES.map((role) => (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setInviteRole(role)}
                    className={
                      'flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ' +
                      (inviteRole === role
                        ? 'border-brand-teal bg-brand-teal/5 text-brand-teal'
                        : 'border-[#dddddd] text-[#4d4e50] hover:bg-[#f5f5f5]')
                    }
                  >
                    {role}
                    {inviteRole === role && <Check className="size-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </SidePanel>
      )}

      {toast && <Toast message={toast.message} tone={toast.tone} onDone={clearToast} />}
    </AppShell>
  )
}
