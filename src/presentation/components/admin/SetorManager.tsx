import { useState, type FormEvent } from 'react'
import { useCreateSetor } from '@/application/hooks/useCreateSetor'
import { useSetores } from '@/application/hooks/useSetores'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SetorManagerProps {
  companyId: string
}

export function SetorManager({ companyId }: SetorManagerProps) {
  const { data: setores, isLoading } = useSetores(companyId)
  const createSetor = useCreateSetor()
  const [name, setName] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await createSetor.mutateAsync({ companyId, name })
    setName('')
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="setor-name">Novo setor</Label>
          <Input id="setor-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <Button type="submit" disabled={createSetor.isPending}>
          {createSetor.isPending ? 'Salvando...' : 'Adicionar'}
        </Button>
      </form>
      {createSetor.isError && <p className="text-sm text-destructive">Erro ao criar setor.</p>}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : setores && setores.length > 0 ? (
        <ul className="space-y-1 text-sm">
          {setores.map((setor) => (
            <li key={setor.id} className="border-b py-1.5 last:border-0">
              {setor.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum setor cadastrado nesta empresa ainda.</p>
      )}
    </div>
  )
}
