import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InviteUserData } from '../../domain/repositories/IUserInvitationGateway'
import { inviteUser } from '../../infrastructure/factory'

export function useInviteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: InviteUserData) => inviteUser.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
    },
  })
}
