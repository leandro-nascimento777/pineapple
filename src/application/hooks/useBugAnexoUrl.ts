import { useQuery } from '@tanstack/react-query'
import { getBugAnexoUrl } from '../../infrastructure/factory'

export function useBugAnexoUrl(storagePath: string) {
  return useQuery({
    queryKey: ['bug-anexo-url', storagePath],
    queryFn: () => getBugAnexoUrl.execute(storagePath),
    staleTime: 1000 * 60 * 30,
  })
}
