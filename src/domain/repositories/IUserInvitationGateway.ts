export interface InviteUserData {
  email: string
  name: string
  companyId: string
}

export interface IUserInvitationGateway {
  invite(data: InviteUserData): Promise<{ userId: string }>
}
