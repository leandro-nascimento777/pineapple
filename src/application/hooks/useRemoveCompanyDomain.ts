import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeCompanyDomain } from '../../infrastructure/factory'

export function useRemoveCompanyDomain(companyId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => removeCompanyDomain.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-domains', companyId] })
    },
  })
}
