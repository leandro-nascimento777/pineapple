import { useQuery } from '@tanstack/react-query'
import { listProjectIdsByProfile } from '../../infrastructure/factory'

export function useProjectIdsByProfile(profileId: string) {
  return useQuery({
    queryKey: ['profile-projects', profileId],
    queryFn: () => listProjectIdsByProfile.execute(profileId),
  })
}
