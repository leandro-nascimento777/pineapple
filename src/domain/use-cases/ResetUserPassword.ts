import type { IUserPasswordGateway, ResetUserPasswordData } from '../repositories/IUserPasswordGateway'

export class ResetUserPassword {
  private readonly passwordGateway: IUserPasswordGateway

  constructor(passwordGateway: IUserPasswordGateway) {
    this.passwordGateway = passwordGateway
  }

  execute(data: ResetUserPasswordData): Promise<void> {
    return this.passwordGateway.resetPassword(data)
  }
}
