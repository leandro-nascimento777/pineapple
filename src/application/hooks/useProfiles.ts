import { useQuery } from '@tanstack/react-query'
import { listProfiles } from '../../infrastructure/factory'

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: () => listProfiles.execute(),
  })
}
