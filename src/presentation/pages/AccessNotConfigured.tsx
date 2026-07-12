import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function AccessNotConfigured() {
  const { signOut } = useAccessResolution()

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Acesso não configurado</CardTitle>
          <CardDescription>
            Seu acesso ainda não foi liberado por um administrador. Fale com o time responsável para
            associar sua conta a uma empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => signOut()}>
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
