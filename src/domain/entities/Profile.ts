export type ProfileRole = 'admin' | 'dev' | 'user' | 'pending'

export interface Profile {
  id: string
  companyId: string | null
  role: ProfileRole
  name: string
}
