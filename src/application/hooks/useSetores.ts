import { useQuery } from '@tanstack/react-query'
import { listSetoresByCompany } from '../../infrastructure/factory'

export function useSetores(companyId: string | undefined) {
  return useQuery({
    queryKey: ['setores', companyId],
    queryFn: () => listSetoresByCompany.execute(companyId as string),
    enabled: Boolean(companyId),
  })
}
