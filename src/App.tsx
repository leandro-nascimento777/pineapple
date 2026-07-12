import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { AppLayout } from '@/presentation/layouts/AppLayout'
import { AccessNotConfigured } from '@/presentation/pages/AccessNotConfigured'
import { CompaniesDashboard } from '@/presentation/pages/CompaniesDashboard'
import { CompanyBugQueue } from '@/presentation/pages/CompanyBugQueue'
import { CompanyDashboard } from '@/presentation/pages/CompanyDashboard'
import { Login } from '@/presentation/pages/Login'
import { ProjectSelection } from '@/presentation/pages/ProjectSelection'
import { SettingsPage } from '@/presentation/pages/SettingsPage'

function RootRedirect() {
  const { state } = useAccessResolution()

  if (state.status === 'loading') {
    return <p className="p-6 text-sm text-muted-foreground">Carregando...</p>
  }
  if (state.status === 'logged_out') {
    return <Navigate to="/login" replace />
  }
  if (state.resolution.type === 'admin' || state.resolution.type === 'dev') {
    return <Navigate to="/empresas" replace />
  }
  if (state.resolution.type === 'company') {
    return <Navigate to="/projetos" replace />
  }
  return <Navigate to="/acesso-nao-configurado" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route index element={<RootRedirect />} />
          <Route path="/projetos" element={<ProjectSelection />} />
          <Route path="/dashboard/:projectId" element={<CompanyDashboard />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="/empresas" element={<CompaniesDashboard />} />
          <Route path="/empresas/:companyId" element={<CompanyBugQueue />} />
          <Route path="/acesso-nao-configurado" element={<AccessNotConfigured />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
