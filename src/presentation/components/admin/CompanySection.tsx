import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CompanyDomains } from './CompanyDomains'
import { CompanyUserManager } from './CompanyUserManager'
import { ProjectManager } from './ProjectManager'
import { SetorManager } from './SetorManager'

interface CompanySectionProps {
  companyId: string
}

export function CompanySection({ companyId }: CompanySectionProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Domínios de email</p>
        <CompanyDomains companyId={companyId} />
      </div>

      <Tabs defaultValue="projetos">
        <TabsList>
          <TabsTrigger value="projetos">Projetos</TabsTrigger>
          <TabsTrigger value="setores">Setores</TabsTrigger>
          <TabsTrigger value="equipe">Equipe</TabsTrigger>
        </TabsList>
        <TabsContent value="projetos">
          <ProjectManager companyId={companyId} />
        </TabsContent>
        <TabsContent value="setores">
          <SetorManager companyId={companyId} />
        </TabsContent>
        <TabsContent value="equipe">
          <CompanyUserManager companyId={companyId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
