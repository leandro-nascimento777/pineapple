export type ProfileRole = 'admin' | 'user' | 'pending'

export interface Profile {
  id: string
  companyId: string | null
  role: ProfileRole
  name: string
}
