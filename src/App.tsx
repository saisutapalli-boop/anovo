import { Routes, Route, Navigate } from 'react-router-dom'
import { DispensingCaseProvider } from './context/DispensingCaseContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ReferralIntakeListPage from './pages/ReferralIntakeListPage'
import ReferralIntakeDetailPage from './pages/ReferralIntakeDetailPage'
import ReferralIntakeCompletePage from './pages/ReferralIntakeCompletePage'
import PriorAuthorizationListPage from './pages/PriorAuthorizationListPage'
import PriorAuthorizationDetailPage from './pages/PriorAuthorizationDetailPage'
import FinancialClearancePage from './pages/FinancialClearancePage'
import DispensingHubPage from './pages/DispensingHubPage'
import DispensingCaseDetailPage from './pages/DispensingCaseDetailPage'
import ClinicalAssessmentsPage from './pages/ClinicalAssessmentsPage'
import AuditReportsPage from './pages/AuditReportsPage'
import ConsultationsPage from './pages/ConsultationsPage'
import UserManagementPage from './pages/UserManagementPage'
import SettingsPage from './pages/SettingsPage'
import HelpPage from './pages/HelpPage'

function App() {
  return (
    <DispensingCaseProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/referral-intake" element={<ReferralIntakeListPage />} />
        <Route path="/referral-intake/:caseId" element={<ReferralIntakeDetailPage />} />
        <Route path="/referral-intake/:caseId/complete" element={<ReferralIntakeCompletePage />} />
        <Route path="/prior-authorization" element={<PriorAuthorizationListPage />} />
        <Route path="/prior-authorization/:caseId" element={<PriorAuthorizationDetailPage />} />
        <Route path="/prior-authorization/:caseId/financial-clearance" element={<FinancialClearancePage />} />
        <Route path="/dispensing" element={<DispensingHubPage />} />
        <Route path="/dispensing/:caseId" element={<DispensingCaseDetailPage />} />
        <Route path="/clinical-assessments" element={<ClinicalAssessmentsPage />} />
        <Route path="/audit-reports" element={<AuditReportsPage />} />
        <Route path="/consultations" element={<ConsultationsPage />} />
        <Route path="/user-management" element={<UserManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </DispensingCaseProvider>
  )
}

export default App
