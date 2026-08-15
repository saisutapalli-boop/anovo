import type { TimelineEvent } from '@/components/ui/CaseActivityTimeline'

// Shared source of truth for Sarah Mitchell's case (ANV-2026-10482) so the
// same record reads identically on the Prior Authorization and Dispensing
// Hub detail pages.
export const CASE_REF = 'ANV-2026-10482'

export const HISTORICAL_EVENTS: TimelineEvent[] = [
  { title: 'Referral validated and handed off to Benefit Investigation', meta: 'Day 1 · Intake complete', marker: 'check' },
  { title: 'Aetna PA requirement identified', meta: 'Day 2 · Eligibility & PA', marker: 'check' },
]

export const SIMULATED_EVENTS: TimelineEvent[] = [
  { title: 'Clinical evidence request sent to prescriber', meta: 'Today · SureScripts · clinical documentation requested', marker: 'dot' },
  { title: 'Prescriber submitted ePA with clinical documents', meta: 'Today · clinical documents attached · ePA submitted', marker: 'dot' },
  { title: 'ePA received by Aetna', meta: 'Today · Aetna intake confirmed · Submission ID EPA-ANV-10482', marker: 'dot' },
  { title: 'PA approved by Aetna', meta: 'Today · Case status updated · Sarah is access cleared', marker: 'check', tone: 'success' },
  { title: 'Case moved to Dispensing Queue', meta: 'Last status · Ready for pharmacist verification · Drug: Voxzogo (vosoritide)', marker: 'check', tone: 'success' },
]
