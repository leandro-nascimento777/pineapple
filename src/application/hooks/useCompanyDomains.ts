import { useQuery } from '@tanstack/react-query'
import { listCompanyDomains } from '../../infrastructure/factory'

export function useCompanyDomains(companyId: string) {
  return useQuery({
    queryKey: ['company-domains', companyId],
    queryFn: () => listCompanyDomains.execute(companyId),
  })
}
