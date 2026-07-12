import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateCompanyDomainData } from '../../domain/repositories/ICompanyDomainRepository'
import { addCompanyDomain } from '../../infrastructure/factory'

export function useAddCompanyDomain() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCompanyDomainData) => addCompanyDomain.execute(data),
    onSuccess: (domain) => {
      queryClient.invalidateQueries({ queryKey: ['company-domains', domain.companyId] })
    },
  })
}
