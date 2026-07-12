import type { InviteUserData, IUserInvitationGateway } from '../../domain/repositories/IUserInvitationGateway'
import { supabase } from './client'

export class SupabaseUserInvitationGateway implements IUserInvitationGateway {
  async invite(data: InviteUserData): Promise<{ userId: string }> {
    const { data: result, error } = await supabase.functions.invoke('admin-invite-user', {
      body: data,
    })

    if (error) throw error
    return result as { userId: string }
  }
}
