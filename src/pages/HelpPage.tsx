import { useState } from 'react'
import { LifeBuoy, Mail, MessageCircle, ChevronDown, FilePlus, ShieldCheck, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import SearchInput from '@/components/ui/SearchInput'
import Button from '@/components/ui/Button'

const FAQS = [
  {
    q: 'How do I resolve an OCR review flag on a referral?',
    a: 'Open the referral from the Referral Intakes list, review the flagged field under AI Extracted Fields, then either Edit the value or Confirm it if the OCR read is correct. Once every flagged field is confirmed and the pharmacy card is attached, Complete Intake becomes available.',
  },
  {
    q: 'Why is a case stuck on "Pharmacist Verification"?',
    a: 'Cases wait for pharmacist verification once PA is approved and copay consent is received. Open the case from Dispensing Hub and use Approve for Dispensing once the financial breakdown has been reviewed.',
  },
  {
    q: 'How do I request a patient’s pharmacy benefit card?',
    a: 'From a referral’s AI Extracted Fields panel, use Request Pharmacy Card to send a secure portal / SMS / email request. The case timeline updates automatically once the card is received and matched.',
  },
  {
    q: 'What do the case progress steps mean?',
    a: 'Every case moves through 7 stages: Intake, Validated, Docs OK, Hand Off, BI (Benefit Investigation), PA (Prior Authorization), and Dispense. You can expand Case Progress on any row to see exactly where a case stands.',
  },
  {
    q: 'How do I generate a compliance report?',
    a: 'Go to Audit & Reports, choose a report type and date range under Generate Report, then click Generate Report. It appears immediately under Recent Reports for download.',
  },
]

const QUICK_LINKS = [
  { label: 'Review a referral intake', href: '/referral-intake', icon: FilePlus },
  { label: 'Check a prior authorization', href: '/prior-authorization', icon: ShieldCheck },
  { label: 'Open the dispensing queue', href: '/dispensing', icon: Package },
]

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const filteredFaqs = FAQS.filter((f) => {
    const q = search.trim().toLowerCase()
    return !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
  })

  return (
    <AppShell active="dashboard" showNav={false}>
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-[#dddddd] bg-white p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-teal/10">
            <LifeBuoy className="size-6 text-brand-teal" />
          </div>
          <p className="text-2xl tracking-[-0.12px] text-[#383838]">How can we help?</p>
          <p className="text-sm text-[#666666]">Search the knowledge base or jump straight to a workflow below.</p>
          <SearchInput value={search} onChange={setSearch} placeholder="Search help articles..." className="w-full max-w-md" />
        </div>

        <div className="grid w-full grid-cols-1 gap-4 wide:grid-cols-3">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="flex items-center gap-3 rounded-xl border border-[#dddddd] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-teal/30 hover:shadow-[0_8px_24px_rgba(0,89,115,0.08)]"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-teal/10">
                <l.icon className="size-5 text-brand-teal" />
              </div>
              <p className="text-sm font-semibold text-[#383838]">{l.label}</p>
            </Link>
          ))}
        </div>

        <div className="flex w-full flex-col gap-2 rounded-xl border border-[#dddddd] bg-white p-6">
          <p className="text-base font-bold text-[#383838]">Frequently Asked Questions</p>
          <div className="flex flex-col divide-y divide-[#f0f0f0]">
            {filteredFaqs.length === 0 && (
              <p className="py-6 text-center text-sm text-[#788a95]">No help articles match your search.</p>
            )}
            {filteredFaqs.map((f, i) => {
              const open = openIndex === i
              return (
                <div key={f.q} className="py-2">
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex w-full items-center justify-between gap-3 py-2.5 text-left"
                  >
                    <span className="text-sm font-semibold text-[#383838]">{f.q}</span>
                    <ChevronDown className={`size-4 shrink-0 text-[#788a95] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </button>
                  <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                    <div className="overflow-hidden">
                      <p className="pb-3 text-sm leading-relaxed text-[#666666]">{f.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-[#dddddd] bg-white p-8 text-center">
          <p className="text-base font-bold text-[#383838]">Still need help?</p>
          <p className="text-sm text-[#666666]">Our support team responds within one business hour.</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button>
              <MessageCircle className="size-4" />
              Start Live Chat
            </Button>
            <Button variant="secondary">
              <Mail className="size-4" />
              support@anovorx.com
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
