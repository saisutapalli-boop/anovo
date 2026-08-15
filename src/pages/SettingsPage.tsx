import { useState } from 'react'
import { User, Bell, Lock, MapPin, ShieldCheck } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import Button from '@/components/ui/Button'
import Toggle from '@/components/ui/Toggle'
import FilterDropdown from '@/components/ui/FilterDropdown'
import Toast from '@/components/ui/Toast'

const HUB_SITES = ['All Regional Hub Sites', 'Nashville, TN', 'Austin, TX', 'Columbus, OH', 'Sacramento, CA']

const inputClass =
  'w-full rounded-lg border border-[#dddddd] bg-white px-4 py-2.5 text-sm text-[#383838] outline-none transition-all duration-200 focus:border-brand-teal focus:shadow-[0_0_0_3px_rgba(0,89,115,0.12)] hover:border-brand-teal/40'

function SettingsCard({ icon: Icon, title, description, children }: { icon: typeof User; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-5 rounded-xl border border-[#dddddd] bg-white p-6">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-teal/10">
          <Icon className="size-5 text-brand-teal" />
        </div>
        <div>
          <p className="text-base font-bold text-[#383838]">{title}</p>
          <p className="text-sm text-[#666666]">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [name, setName] = useState('Alex Morgan')
  const [email, setEmail] = useState('alex.morgan@anovorx.com')
  const [phone, setPhone] = useState('(615) 555-0142')
  const [hubSite, setHubSite] = useState(HUB_SITES[1])

  const [emailNotifs, setEmailNotifs] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  const [twoFactor, setTwoFactor] = useState(true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [toast, setToast] = useState<string | null>(null)

  function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setToast('Profile settings saved')
  }

  function saveNotifications() {
    setToast('Notification preferences updated')
  }

  function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!currentPassword || !newPassword) {
      setPasswordError('Enter your current and new password.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }
    setPasswordError('')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setToast('Password updated successfully')
  }

  return (
    <AppShell active="settings" showNav={false}>
      <div className="flex w-full flex-col gap-6">
        <div>
          <p className="text-2xl tracking-[-0.12px] text-[#383838]">Settings</p>
          <p className="text-sm text-[#666666]">Manage your profile, notifications, security and workspace preferences.</p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 wide:grid-cols-2">
          <SettingsCard icon={User} title="Profile Settings" description="Your personal account information.">
            <form onSubmit={saveProfile} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-teal text-xl font-bold text-white">
                  {name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#383838]">{name}</p>
                  <p className="text-xs text-[#666666]">Super Admin</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#383838]">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#383838]">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#383838]">Phone Number</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#383838]">
                  <MapPin className="size-3.5 text-brand-green" /> Default Hub Site
                </label>
                <FilterDropdown value={hubSite} options={HUB_SITES} onChange={setHubSite} />
              </div>
              <Button type="submit" className="self-start">
                Save Changes
              </Button>
            </form>
          </SettingsCard>

          <SettingsCard icon={Bell} title="Notification Preferences" description="Choose how you want to be notified.">
            <div className="flex flex-col divide-y divide-[#f0f0f0]">
              <Toggle
                checked={emailNotifs}
                onChange={(v) => {
                  setEmailNotifs(v)
                  saveNotifications()
                }}
                label="Email Notifications"
                description="Case updates, PA decisions and referral flags"
              />
              <Toggle
                checked={smsAlerts}
                onChange={(v) => {
                  setSmsAlerts(v)
                  saveNotifications()
                }}
                label="SMS Alerts"
                description="Urgent SLA-risk and critical flag alerts"
              />
              <Toggle
                checked={pushNotifs}
                onChange={(v) => {
                  setPushNotifs(v)
                  saveNotifications()
                }}
                label="Push Notifications"
                description="Browser push notifications while signed in"
              />
              <Toggle
                checked={weeklyDigest}
                onChange={(v) => {
                  setWeeklyDigest(v)
                  saveNotifications()
                }}
                label="Weekly Digest"
                description="Summary of hub performance every Monday"
              />
            </div>
          </SettingsCard>

          <SettingsCard icon={Lock} title="Change Password" description="Update your account password.">
            <form onSubmit={changePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#383838]">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#383838]">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#383838]">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              {passwordError && <p className="text-xs font-semibold text-rose-600">{passwordError}</p>}
              <Button type="submit" className="self-start">
                Update Password
              </Button>
            </form>
          </SettingsCard>

          <SettingsCard icon={ShieldCheck} title="Security" description="Protect your account with extra verification.">
            <div className="flex flex-col divide-y divide-[#f0f0f0]">
              <Toggle
                checked={twoFactor}
                onChange={(v) => {
                  setTwoFactor(v)
                  setToast(v ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled')
                }}
                label="Two-Factor Authentication"
                description="Require a verification code at sign in"
              />
            </div>
            <div className="rounded-lg bg-[#f5f5f5] p-4 text-xs text-[#666666]">
              Your account was last signed in from Nashville, TN on Aug 14, 2026. If this wasn&rsquo;t you, update your
              password immediately.
            </div>
          </SettingsCard>
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </AppShell>
  )
}
