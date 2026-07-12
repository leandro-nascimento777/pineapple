import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { AppLayout } from '@/presentation/layouts/AppLayout'
import { AccessNotConfigured } from '@/presentation/pages/AccessNotConfigured'
import { AdminPage } from '@/presentation/pages/AdminPage'
import { AdminProjectsDashboard } from '@/presentation/pages/AdminProjectsDashboard'
import { CompanyDashboard } from '@/presentation/pages/CompanyDashboard'
import { Login } from '@/presentation/pages/Login'
import { ProjectSelection } from '@/presentation/pages/ProjectSelection'

function RootRedirect() {
  const { state } = useAccessResolution()

  if (state.status === 'loading') {
    return <p className="p-6 text-sm text-muted-foreground">Carregando...</p>
  }
  if (state.status === 'logged_out') {
    return <Navigate to="/login" replace />
  }
  if (state.resolution.type === 'admin') {
    return <Navigate to="/admin/projetos" replace />
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
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/projetos" element={<AdminProjectsDashboard />} />
          <Route path="/acesso-nao-configurado" element={<AccessNotConfigured />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
