import { useState } from 'react'
import { useResetUserPassword } from '@/application/hooks/useResetUserPassword'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ResetPasswordControl({ profileId }: { profileId: string }) {
  const resetPassword = useResetUserPassword()
  const [showForm, setShowForm] = useState(false)
  const [password, setPassword] = useState('')

  async function handleReset() {
    await resetPassword.mutateAsync({ userId: profileId, password })
    setPassword('')
    setShowForm(false)
  }

  if (!showForm) {
    return (
      <Button size="sm" variant="outline" type="button" onClick={() => setShowForm(true)}>
        Redefinir senha
      </Button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        type="password"
        placeholder="Nova senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="h-8 w-36"
      />
      <Button size="sm" type="button" onClick={handleReset} disabled={resetPassword.isPending || password.length < 6}>
        {resetPassword.isPending ? 'Salvando...' : 'Salvar'}
      </Button>
      <Button size="sm" variant="outline" type="button" onClick={() => setShowForm(false)}>
        Cancelar
      </Button>
      {resetPassword.isError && <p className="text-xs text-destructive">{resetPassword.error.message}</p>}
    </div>
  )
}
