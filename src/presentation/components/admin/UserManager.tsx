import { useState, type FormEvent } from 'react'
import { useCompanies } from '@/application/hooks/useCompanies'
import { useInviteUser } from '@/application/hooks/useInviteUser'
import { useProfiles } from '@/application/hooks/useProfiles'
import { useUpdateProfile } from '@/application/hooks/useUpdateProfile'
import type { Company } from '@/domain/entities/Company'
import type { Profile, ProfileRole } from '@/domain/entities/Profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ROLE_LABEL: Record<ProfileRole, string> = {
  admin: 'Admin',
  user: 'Usuário',
  pending: 'Pendente',
}

function ProfileRow({ profile, companies }: { profile: Profile; companies: Company[] }) {
  const updateProfile = useUpdateProfile()
  const [role, setRole] = useState<Exclude<ProfileRole, 'pending'>>(profile.role === 'admin' ? 'admin' : 'user')
  const [companyId, setCompanyId] = useState(profile.companyId ?? '')

  const companyName = companies.find((c) => c.id === profile.companyId)?.name

  async function handleSave() {
    await updateProfile.mutateAsync({
      userId: profile.id,
      role,
      companyId: role === 'admin' ? null : companyId || null,
    })
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-b py-2 last:border-0">
      <div>
        <p className="text-sm font-medium">{profile.name}</p>
        <p className="text-xs text-muted-foreground">
          {ROLE_LABEL[profile.role]}
          {companyName ? ` · ${companyName}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Select value={role} onValueChange={(value) => setRole(value as Exclude<ProfileRole, 'pending'>)}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">Usuário</SelectItem>
          </SelectContent>
        </Select>
        {role === 'user' && (
          <Select value={companyId} onValueChange={setCompanyId}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Empresa" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateProfile.isPending || (role === 'user' && !companyId)}
        >
          Salvar
        </Button>
      </div>
    </li>
  )
}

export function UserManager() {
  const { data: profiles, isLoading } = useProfiles()
  const { data: companies } = useCompanies()
  const inviteUser = useInviteUser()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [companyId, setCompanyId] = useState('')

  async function handleInvite(event: FormEvent) {
    event.preventDefault()
    await inviteUser.mutateAsync({ email, name, companyId })
    setEmail('')
    setName('')
    setCompanyId('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Usuários</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="invite-name">Nome</Label>
            <Input id="invite-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invite-company">Empresa</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger id="invite-company" className="w-40">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {(companies ?? []).map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={inviteUser.isPending || !companyId}>
            {inviteUser.isPending ? 'Convidando...' : 'Convidar usuário'}
          </Button>
        </form>
        {inviteUser.isError && <p className="text-sm text-destructive">Erro ao convidar usuário.</p>}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : (
          <ul>
            {(profiles ?? []).map((profile) => (
              <ProfileRow key={profile.id} profile={profile} companies={companies ?? []} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
