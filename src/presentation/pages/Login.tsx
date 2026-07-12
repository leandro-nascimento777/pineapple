import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Login() {
  const { state, signInWithMagicLink } = useAccessResolution()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (state.status === 'resolved') {
    const destination =
      state.resolution.type === 'admin' || state.resolution.type === 'dev'
        ? '/empresas'
        : state.resolution.type === 'company'
          ? '/projetos'
          : '/acesso-nao-configurado'
    return <Navigate to={destination} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await signInWithMagicLink(email)
      setSent(true)
    } catch {
      setError('Não foi possível enviar o link. Verifique o email e tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Digite seu email para receber um link de acesso.</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-muted-foreground">
              Enviamos um link mágico para <strong>{email}</strong>. Abra seu email para continuar.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@empresa.com"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar link mágico'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
