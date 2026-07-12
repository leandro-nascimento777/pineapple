import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Bug } from '@/domain/entities/Bug'
import { useAssumeBug } from '@/application/hooks/useAssumeBug'
import { useBugAnexoUrl } from '@/application/hooks/useBugAnexoUrl'
import { useResolveBug } from '@/application/hooks/useResolveBug'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { resolveBugSchema, type ResolveBugFormValues } from '@/shared/schemas/bug.schema'
import { Avatar } from './Avatar'
import { BugStatusBadge } from './BugCard'
import { STATUS_CARD_CLASSES } from './bugStatusStyles'

function BugAnexoThumbnail({ storagePath }: { storagePath: string }) {
  const { data: url, isLoading } = useBugAnexoUrl(storagePath)

  if (isLoading || !url) {
    return <div className="size-24 animate-pulse rounded-md bg-muted" />
  }

  return (
    <a href={url} target="_blank" rel="noreferrer">
      <img src={url} alt="Anexo do bug" className="size-24 rounded-md border object-cover" />
    </a>
  )
}

interface BugDetailProps {
  bug: Bug
  canManage: boolean
  currentUserId: string
  onBack: () => void
}

export function BugDetail({ bug, canManage, currentUserId, onBack }: BugDetailProps) {
  const assumeBug = useAssumeBug()
  const resolveBug = useResolveBug()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResolveBugFormValues>({
    resolver: zodResolver(resolveBugSchema),
    defaultValues: { parecer: bug.parecer ?? '' },
  })

  const canAssume = canManage && bug.status === 'aberto'
  const canResolve = canManage && bug.status === 'em_tratamento'

  async function onSubmit(values: ResolveBugFormValues) {
    await resolveBug.mutateAsync({ bugId: bug.id, parecer: values.parecer, resolvidoPor: currentUserId })
  }

  return (
    <Card className={STATUS_CARD_CLASSES[bug.status]}>
      <CardHeader className="space-y-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="w-fit px-0">
          ← Voltar
        </Button>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{bug.titulo}</CardTitle>
          <BugStatusBadge status={bug.status} />
        </div>
        <CardDescription>
          Setor: {bug.setorNome}
          {bug.projectName ? ` · Projeto: ${bug.projectName}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre-wrap text-sm">{bug.descricao}</p>

        {bug.assumidoPorNome && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar label={bug.assumidoPorNome} />
            <span>Assumido por {bug.assumidoPorNome}</span>
          </div>
        )}

        {bug.anexos.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Anexos</p>
            <div className="flex flex-wrap gap-2">
              {bug.anexos.map((anexo) => (
                <BugAnexoThumbnail key={anexo.id} storagePath={anexo.storagePath} />
              ))}
            </div>
          </div>
        )}

        {bug.parecer && (
          <div className="rounded-md border bg-muted/40 p-3">
            <p className="text-sm font-medium">Parecer</p>
            <p className="text-sm text-muted-foreground">{bug.parecer}</p>
          </div>
        )}

        {canAssume && (
          <div className="space-y-2 border-t pt-4">
            {assumeBug.isError && (
              <p className="text-sm text-destructive">Erro ao assumir o bug. Tente novamente.</p>
            )}
            <Button
              onClick={() => assumeBug.mutate({ bugId: bug.id, assumidoPor: currentUserId })}
              disabled={assumeBug.isPending}
            >
              {assumeBug.isPending ? 'Assumindo...' : 'Assumir bug'}
            </Button>
          </div>
        )}

        {canResolve && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 border-t pt-4">
            <Label htmlFor="parecer">Parecer</Label>
            <Textarea id="parecer" rows={3} {...register('parecer')} />
            {errors.parecer && <p className="text-sm text-destructive">{errors.parecer.message}</p>}
            {resolveBug.isError && (
              <p className="text-sm text-destructive">Erro ao resolver o bug. Tente novamente.</p>
            )}
            <Button type="submit" disabled={resolveBug.isPending}>
              {resolveBug.isPending ? 'Salvando...' : 'Marcar como resolvido'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
