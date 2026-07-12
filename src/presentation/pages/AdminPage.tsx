import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { useCompanies } from '@/application/hooks/useCompanies'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CompanyManager } from '@/presentation/components/admin/CompanyManager'
import { ProjectManager } from '@/presentation/components/admin/ProjectManager'
import { SetorManager } from '@/presentation/components/admin/SetorManager'
import { UserManager } from '@/presentation/components/admin/UserManager'

export function AdminPage() {
  const { state } = useAccessResolution()
  const { data: companies } = useCompanies()
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(undefined)

  if (state.status === 'loading') {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }
  if (state.status === 'logged_out') {
    return <Navigate to="/login" replace />
  }
  if (state.resolution.type !== 'admin') {
    return <Navigate to={state.resolution.type === 'company' ? '/projetos' : '/acesso-nao-configurado'} replace />
  }

  const companyId = selectedCompanyId ?? companies?.[0]?.id

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Administração</h1>

      <CompanyManager />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Projetos e setores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-company">Empresa</Label>
            <Select value={companyId} onValueChange={setSelectedCompanyId}>
              <SelectTrigger id="admin-company" className="w-64">
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {(companies ?? []).map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {companyId ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Projetos</h3>
                <ProjectManager companyId={companyId} />
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Setores</h3>
                <SetorManager companyId={companyId} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Cadastre uma empresa para gerenciar projetos e setores.</p>
          )}
        </CardContent>
      </Card>

      <UserManager />
    </div>
  )
}
