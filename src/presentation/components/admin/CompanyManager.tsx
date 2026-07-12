import { useState, type FormEvent } from 'react'
import { useCompanies } from '@/application/hooks/useCompanies'
import { useCreateCompany } from '@/application/hooks/useCreateCompany'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CompanyManager() {
  const { data: companies, isLoading } = useCompanies()
  const createCompany = useCreateCompany()
  const [name, setName] = useState('')
  const [emailDomain, setEmailDomain] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await createCompany.mutateAsync({ name, emailDomain })
    setName('')
    setEmailDomain('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Empresas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="company-name">Nome</Label>
            <Input id="company-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company-domain">Domínio do email</Label>
            <Input
              id="company-domain"
              value={emailDomain}
              onChange={(e) => setEmailDomain(e.target.value)}
              placeholder="empresa.com"
              required
            />
          </div>
          <Button type="submit" disabled={createCompany.isPending}>
            {createCompany.isPending ? 'Salvando...' : 'Adicionar empresa'}
          </Button>
        </form>
        {createCompany.isError && <p className="text-sm text-destructive">Erro ao criar empresa.</p>}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : companies && companies.length > 0 ? (
          <ul className="space-y-1 text-sm">
            {companies.map((company) => (
              <li key={company.id} className="flex justify-between border-b py-1.5 last:border-0">
                <span>{company.name}</span>
                <span className="text-muted-foreground">{company.emailDomain}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma empresa cadastrada ainda.</p>
        )}
      </CardContent>
    </Card>
  )
}
