import { useQuery } from '@tanstack/react-query'
import { listCompanies } from '../../infrastructure/factory'

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: () => listCompanies.execute(),
  })
}
