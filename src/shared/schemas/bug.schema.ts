import { z } from 'zod'

export const bugFormSchema = z.object({
  titulo: z.string().trim().min(3, 'Informe um título com pelo menos 3 caracteres'),
  descricao: z.string().trim().min(10, 'Descreva o erro com pelo menos 10 caracteres'),
  setorId: z.string().uuid({ message: 'Selecione um setor' }),
  anexo: z
    .instanceof(File)
    .refine((file) => file.type.startsWith('image/'), 'O anexo precisa ser uma imagem')
    .optional(),
})

export type BugFormValues = z.infer<typeof bugFormSchema>

export const resolveBugSchema = z.object({
  parecer: z.string().trim().min(3, 'Escreva um parecer com pelo menos 3 caracteres'),
})

export type ResolveBugFormValues = z.infer<typeof resolveBugSchema>
