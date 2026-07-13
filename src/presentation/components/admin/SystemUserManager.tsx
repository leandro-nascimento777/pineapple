import { useState, type FormEvent } from 'react'
import { useInviteUser } from '@/application/hooks/useInviteUser'
import { useProfiles } from '@/application/hooks/useProfiles'
import { useUpdateProfile } from '@/application/hooks/useUpdateProfile'
import type { Profile } from '@/domain/entities/Profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ResetPasswordControl } from './ResetPasswordControl'

type SystemRole = 'admin' | 'dev'

const ROLE_LABEL: Record<SystemRole, string> = {
  admin: 'Admin',
  dev: 'Dev',
}

function SystemUserRow({ profile }: { profile: Profile }) {
  const updateProfile = useUpdateProfile()
  const [role, setRole] = useState<SystemRole>(profile.role === 'dev' ? 'dev' : 'admin')

  async function handleSave() {
    await updateProfile.mutateAsync({ userId: profile.id, role, companyId: null })
  }

  return (
    <li className="space-y-2 border-b py-2 last:border-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{profile.name}</p>
          <p className="text-xs text-muted-foreground">{ROLE_LABEL[profile.role === 'dev' ? 'dev' : 'admin']}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={role} onValueChange={(value) => setRole(value as SystemRole)}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="dev">Dev</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleSave} disabled={updateProfile.isPending}>
            Salvar
          </Button>
        </div>
      </div>
      <ResetPasswordControl profileId={profile.id} />
    </li>
  )
}

export function SystemUserManager() {
  const { data: profiles, isLoading } = useProfiles()
  const inviteUser = useInviteUser()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<SystemRole>('dev')

  const systemUsers = (profiles ?? []).filter((p) => p.role === 'admin' || p.role === 'dev')

  async function handleInvite(event: FormEvent) {
    event.preventDefault()
    await inviteUser.mutateAsync({ email, name, password, role })
    setEmail('')
    setName('')
    setPassword('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Usuários do sistema</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="system-invite-name">Nome</Label>
            <Input id="system-invite-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="system-invite-email">Email</Label>
            <Input
              id="system-invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="system-invite-password">Senha</Label>
            <Input
              id="system-invite-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="system-invite-role">Papel</Label>
            <Select value={role} onValueChange={(value) => setRole(value as SystemRole)}>
              <SelectTrigger id="system-invite-role" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="dev">Dev</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={inviteUser.isPending}>
            {inviteUser.isPending ? 'Convidando...' : 'Convidar'}
          </Button>
        </form>
        {inviteUser.isError && (
          <p className="text-sm text-destructive">{inviteUser.error.message}</p>
        )}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : systemUsers.length > 0 ? (
          <ul>
            {systemUsers.map((profile) => (
              <SystemUserRow key={profile.id} profile={profile} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum usuário do sistema ainda.</p>
        )}
      </CardContent>
    </Card>
  )
}
