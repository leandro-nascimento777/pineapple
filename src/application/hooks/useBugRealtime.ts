import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { subscribeToBugUpdates } from '../../infrastructure/factory'

/** Sem projectId (dev), assina mudanças em bugs de todos os projetos. */
export function useBugRealtime(projectId?: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = subscribeToBugUpdates.execute({ projectId }, (bug) => {
      queryClient.invalidateQueries({ queryKey: ['bugs', bug.projectId] })
    })

    return unsubscribe
  }, [projectId, queryClient])
}
