import { useMutation, useQueryClient } from '@tanstack/react-query'
import { replaceProfileProjectAccess } from '../../infrastructure/factory'

export function useReplaceProfileProjectAccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ profileId, projectIds }: { profileId: string; projectIds: string[] }) =>
      replaceProfileProjectAccess.execute(profileId, projectIds),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile-projects', variables.profileId] })
    },
  })
}
