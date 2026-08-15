import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ReferralIntakeListPage from './pages/ReferralIntakeListPage'
import ReferralIntakeDetailPage from './pages/ReferralIntakeDetailPage'
import ReferralIntakeCompletePage from './pages/ReferralIntakeCompletePage'
import PriorAuthorizationListPage from './pages/PriorAuthorizationListPage'
import PriorAuthorizationDetailPage from './pages/PriorAuthorizationDetailPage'
import DispensingHubPage from './pages/DispensingHubPage'
import ClinicalAssessmentsPage from './pages/ClinicalAssessmentsPage'
import AuditReportsPage from './pages/AuditReportsPage'
import ConsultationsPage from './pages/ConsultationsPage'
import UserManagementPage from './pages/UserManagementPage'
import SettingsPage from './pages/SettingsPage'
import HelpPage from './pages/HelpPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/referral-intake" element={<ReferralIntakeListPage />} />
      <Route path="/referral-intake/:caseId" element={<ReferralIntakeDetailPage />} />
      <Route path="/referral-intake/:caseId/complete" element={<ReferralIntakeCompletePage />} />
      <Route path="/prior-authorization" element={<PriorAuthorizationListPage />} />
      <Route path="/prior-authorization/:caseId" element={<PriorAuthorizationDetailPage />} />
      <Route path="/dispensing" element={<DispensingHubPage />} />
      <Route path="/clinical-assessments" element={<ClinicalAssessmentsPage />} />
      <Route path="/audit-reports" element={<AuditReportsPage />} />
      <Route path="/consultations" element={<ConsultationsPage />} />
      <Route path="/user-management" element={<UserManagementPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/help" element={<HelpPage />} />
    </Routes>
  )
}

export default App
