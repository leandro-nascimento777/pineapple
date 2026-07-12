import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { useCompanies } from '@/application/hooks/useCompanies'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/presentation/components/PageHeader'
import { CompanyManager } from '@/presentation/components/admin/CompanyManager'
import { CompanyUserManager } from '@/presentation/components/admin/CompanyUserManager'
import { ProjectManager } from '@/presentation/components/admin/ProjectManager'
import { SetorManager } from '@/presentation/components/admin/SetorManager'
import { SystemUserManager } from '@/presentation/components/admin/SystemUserManager'

type Tab = 'sistema' | 'clientes'

export function SettingsPage() {
  const { state } = useAccessResolution()
  const { data: companies } = useCompanies()
  const [tab, setTab] = useState<Tab>('sistema')
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(undefined)

  if (state.status === 'loading') {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }
  if (state.status === 'logged_out') {
    return <Navigate to="/login" replace />
  }
  if (state.resolution.type !== 'admin') {
    const isStaff = state.resolution.type === 'dev'
    return <Navigate to={isStaff ? '/empresas' : state.resolution.type === 'company' ? '/projetos' : '/acesso-nao-configurado'} replace />
  }

  const companyId = selectedCompanyId ?? companies?.[0]?.id

  return (
    <div>
      <PageHeader
        title="Configurações"
        action={
          <div className="flex gap-2">
            <Button variant={tab === 'sistema' ? 'default' : 'outline'} size="sm" onClick={() => setTab('sistema')}>
              Sistema
            </Button>
            <Button variant={tab === 'clientes' ? 'default' : 'outline'} size="sm" onClick={() => setTab('clientes')}>
              Clientes
            </Button>
          </div>
        }
      />

      {tab === 'sistema' ? (
        <SystemUserManager />
      ) : (
        <div className="space-y-6">
          <CompanyManager />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Projetos, setores e usuários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="settings-company">Empresa</Label>
                <Select value={companyId} onValueChange={setSelectedCompanyId}>
                  <SelectTrigger id="settings-company" className="w-64">
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
                <div className="space-y-6">
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
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                      Usuários que relatam bugs
                    </h3>
                    <CompanyUserManager companyId={companyId} />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Cadastre uma empresa para gerenciar projetos, setores e usuários.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
