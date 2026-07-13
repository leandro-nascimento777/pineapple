import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { AccessResolution } from '../../domain/use-cases/ResolveAccessByProfile'
import { resolveAccessByProfile } from '../../infrastructure/factory'
import { supabase } from '../../infrastructure/supabase/client'

export type AccessResolutionState =
  | { status: 'loading' }
  | { status: 'logged_out' }
  | { status: 'resolved'; resolution: AccessResolution; session: Session }

/**
 * Não há repositório de domínio para autenticação (o prompt não modela sessão/login
 * como caso de uso do bug tracker); Supabase Auth é tratado como a fonte de sessão e
 * este hook é o único lugar em application/ que fala com supabase.auth diretamente.
 */
export function useAccessResolution() {
  const [state, setState] = useState<AccessResolutionState>({ status: 'loading' })

  useEffect(() => {
    let active = true

    async function resolveFromSession(session: Session | null) {
      if (!session) {
        if (active) setState({ status: 'logged_out' })
        return
      }
      const resolution = await resolveAccessByProfile.execute(session.user.id)
      if (active) setState({ status: 'resolved', resolution, session })
    }

    supabase.auth.getSession().then(({ data }) => resolveFromSession(data.session))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      resolveFromSession(session)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function signInWithPassword(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return { state, signInWithPassword, signOut }
}
