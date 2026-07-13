export type InviteUserData =
  | { email: string; name: string; password: string; role: 'admin' | 'dev' }
  | { email: string; name: string; password: string; role: 'user'; companyId: string; projectIds: string[] }

export interface IUserInvitationGateway {
  invite(data: InviteUserData): Promise<{ userId: string }>
}
