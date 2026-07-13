import { useMutation } from '@tanstack/react-query'
import type { ResetUserPasswordData } from '../../domain/repositories/IUserPasswordGateway'
import { resetUserPassword } from '../../infrastructure/factory'

export function useResetUserPassword() {
  return useMutation({
    mutationFn: (data: ResetUserPasswordData) => resetUserPassword.execute(data),
  })
}
