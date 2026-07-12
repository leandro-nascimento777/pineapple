import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateBug } from '@/application/hooks/useCreateBug'
import { useSetores } from '@/application/hooks/useSetores'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { bugFormSchema, type BugFormValues } from '@/shared/schemas/bug.schema'

interface BugFormProps {
  projectId: string
  companyId: string
  criadoPor: string
  onCreated?: () => void
}

export function BugForm({ projectId, companyId, criadoPor, onCreated }: BugFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BugFormValues>({ resolver: zodResolver(bugFormSchema), defaultValues: { setorId: '' } })
  const createBug = useCreateBug()
  const { data: setores } = useSetores(companyId)

  async function onSubmit(values: BugFormValues) {
    await createBug.mutateAsync({
      projectId,
      criadoPor,
      titulo: values.titulo,
      descricao: values.descricao,
      setorId: values.setorId,
      anexo: values.anexo,
    })
    reset()
    onCreated?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="titulo">Título</Label>
        <Input id="titulo" {...register('titulo')} />
        {errors.titulo && <p className="text-sm text-destructive">{errors.titulo.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="descricao">Descrição do erro</Label>
        <Textarea id="descricao" rows={4} {...register('descricao')} />
        {errors.descricao && <p className="text-sm text-destructive">{errors.descricao.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="setorId">Setor</Label>
        <Controller
          control={control}
          name="setorId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="setorId" className="w-full">
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                {(setores ?? []).map((setor) => (
                  <SelectItem key={setor.id} value={setor.id}>
                    {setor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.setorId && <p className="text-sm text-destructive">{errors.setorId.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="anexo">Anexar imagem/print (opcional)</Label>
        <Controller
          control={control}
          name="anexo"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <input
              id="anexo"
              ref={ref}
              name={name}
              onBlur={onBlur}
              type="file"
              accept="image/*"
              onChange={(e) => onChange(e.target.files?.[0])}
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground"
            />
          )}
        />
        {errors.anexo && <p className="text-sm text-destructive">{errors.anexo.message}</p>}
      </div>

      {createBug.isError && <p className="text-sm text-destructive">Erro ao enviar o bug. Tente novamente.</p>}

      <Button type="submit" disabled={createBug.isPending}>
        {createBug.isPending ? 'Enviando...' : 'Enviar'}
      </Button>
    </form>
  )
}
