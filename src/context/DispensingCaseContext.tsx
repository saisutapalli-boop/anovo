import { createContext, useContext, useState, type ReactNode } from 'react'

export type CopayStatus = 'pending' | 'requested' | 'received'
export type VerificationStatus = 'pending' | 'approved'

interface DispensingCaseState {
  copayStatus: CopayStatus
  setCopayStatus: (status: CopayStatus) => void
  verificationStatus: VerificationStatus
  setVerificationStatus: (status: VerificationStatus) => void
  /** Whether the Prior Authorization end-to-end simulation has completed for this case. */
  paSimulationComplete: boolean
  setPaSimulationComplete: (complete: boolean) => void
}

const DispensingCaseContext = createContext<DispensingCaseState | null>(null)

/**
 * Shares Sarah Mitchell's case-readiness progress (PA simulation, copay
 * consent, pharmacist verification) between the Prior Authorization detail
 * page and the Dispensing Hub list/detail pages, so every view of the same
 * case reflects the same underlying record.
 */
export function DispensingCaseProvider({ children }: { children: ReactNode }) {
  const [copayStatus, setCopayStatus] = useState<CopayStatus>('pending')
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending')
  const [paSimulationComplete, setPaSimulationComplete] = useState(false)

  return (
    <DispensingCaseContext.Provider
      value={{
        copayStatus,
        setCopayStatus,
        verificationStatus,
        setVerificationStatus,
        paSimulationComplete,
        setPaSimulationComplete,
      }}
    >
      {children}
    </DispensingCaseContext.Provider>
  )
}

export function useDispensingCase() {
  const ctx = useContext(DispensingCaseContext)
  if (!ctx) throw new Error('useDispensingCase must be used within a DispensingCaseProvider')
  return ctx
}
