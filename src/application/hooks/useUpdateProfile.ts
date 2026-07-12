import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateProfileData } from '../../domain/repositories/IProfileRepository'
import { updateProfile } from '../../infrastructure/factory'

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
    },
  })
}
