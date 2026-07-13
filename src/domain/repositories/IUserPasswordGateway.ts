export interface ResetUserPasswordData {
  userId: string
  password: string
}

export interface IUserPasswordGateway {
  resetPassword(data: ResetUserPasswordData): Promise<void>
}
