import { useMemo, useState, type FormEvent } from 'react'
import { useCompanies } from '@/application/hooks/useCompanies'
import { useCreateCompany } from '@/application/hooks/useCreateCompany'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CompanySection } from './CompanySection'

export function CompanyManager() {
  const { data: companies, isLoading } = useCompanies()
  const createCompany = useCreateCompany()
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await createCompany.mutateAsync({ name })
    setName('')
    setShowAddForm(false)
  }

  const filteredCompanies = useMemo(() => {
    if (!companies) return []
    const term = search.trim().toLowerCase()
    if (!term) return companies
    return companies.filter((company) => company.name.toLowerCase().includes(term))
  }, [companies, search])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar empresa..."
          className="max-w-xs"
        />
        <Button type="button" variant={showAddForm ? 'outline' : 'default'} onClick={() => setShowAddForm((prev) => !prev)}>
          {showAddForm ? 'Cancelar' : 'Nova empresa'}
        </Button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-3 rounded-lg border border-hairline bg-panel p-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="company-name">Nome</Label>
            <Input id="company-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          </div>
          <Button type="submit" disabled={createCompany.isPending}>
            {createCompany.isPending ? 'Salvando...' : 'Salvar empresa'}
          </Button>
        </form>
      )}
      {createCompany.isError && <p className="text-sm text-destructive">Erro ao criar empresa.</p>}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : filteredCompanies.length > 0 ? (
        <Accordion type="multiple" className="space-y-3">
          {filteredCompanies.map((company) => (
            <AccordionItem
              key={company.id}
              value={company.id}
              className="rounded-lg border border-hairline bg-panel px-4"
            >
              <AccordionTrigger className="text-base">{company.name}</AccordionTrigger>
              <AccordionContent>
                <CompanySection companyId={company.id} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-sm text-muted-foreground">
          {companies && companies.length > 0 ? 'Nenhuma empresa encontrada.' : 'Nenhuma empresa cadastrada ainda.'}
        </p>
      )}
    </div>
  )
}
