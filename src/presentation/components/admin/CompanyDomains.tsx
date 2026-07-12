import { useState, type FormEvent } from 'react'
import { useAddCompanyDomain } from '@/application/hooks/useAddCompanyDomain'
import { useCompanyDomains } from '@/application/hooks/useCompanyDomains'
import { useRemoveCompanyDomain } from '@/application/hooks/useRemoveCompanyDomain'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CompanyDomainsProps {
  companyId: string
}

export function CompanyDomains({ companyId }: CompanyDomainsProps) {
  const { data: domains, isLoading } = useCompanyDomains(companyId)
  const addDomain = useAddCompanyDomain()
  const removeDomain = useRemoveCompanyDomain(companyId)
  const [domain, setDomain] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await addDomain.mutateAsync({ companyId, domain })
    setDomain('')
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {isLoading ? (
          <span className="text-xs text-muted-foreground">Carregando domínios...</span>
        ) : domains && domains.length > 0 ? (
          domains.map((d) => (
            <span
              key={d.id}
              className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2 py-0.5 text-xs"
            >
              {d.domain}
              <button
                type="button"
                onClick={() => removeDomain.mutate(d.id)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remover domínio ${d.domain}`}
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">Nenhum domínio cadastrado.</span>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="empresa.com"
          className="h-7 w-40 text-xs"
          required
        />
        <Button type="submit" size="xs" variant="outline" disabled={addDomain.isPending}>
          Adicionar domínio
        </Button>
      </form>
    </div>
  )
}
