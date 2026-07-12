import { useQuery } from '@tanstack/react-query'
import { listBugsByCompany } from '../../infrastructure/factory'

export function useBugsByCompany(companyId: string | undefined) {
  return useQuery({
    queryKey: ['bugs-by-company', companyId],
    queryFn: () => listBugsByCompany.execute(companyId as string),
    enabled: Boolean(companyId),
  })
}
