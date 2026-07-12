import type { InviteUserData, IUserInvitationGateway } from '../repositories/IUserInvitationGateway'

export class InviteUser {
  private readonly invitationGateway: IUserInvitationGateway

  constructor(invitationGateway: IUserInvitationGateway) {
    this.invitationGateway = invitationGateway
  }

  execute(data: InviteUserData): Promise<{ userId: string }> {
    return this.invitationGateway.invite(data)
  }
}
