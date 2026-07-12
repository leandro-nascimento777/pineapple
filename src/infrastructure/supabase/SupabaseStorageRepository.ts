import type { IStorageRepository } from '../../domain/repositories/IStorageRepository'
import { supabase } from './client'

const BUCKET = 'bug-anexos'

const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60

// nomes de arquivo com espaço/acento (comuns em prints do macOS, ex: "Captura de
// Tela ... às 14.57.52.png") quebram a key do storage; mantemos só a extensão.
function fileExtension(fileName: string): string {
  const match = /\.([a-zA-Z0-9]+)$/.exec(fileName)
  return match ? match[1] : ''
}

export class SupabaseStorageRepository implements IStorageRepository {
  async uploadBugAnexo(file: File): Promise<string> {
    const extension = fileExtension(file.name)
    const path = extension ? `${crypto.randomUUID()}.${extension}` : crypto.randomUUID()
    const { error } = await supabase.storage.from(BUCKET).upload(path, file)
    if (error) throw error
    return path
  }

  async getBugAnexoUrl(storagePath: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, SIGNED_URL_EXPIRES_IN_SECONDS)

    if (error) throw error
    return data.signedUrl
  }
}
