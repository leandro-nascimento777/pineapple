import type { IStorageRepository } from '../../domain/repositories/IStorageRepository'
import { supabase } from './client'

const BUCKET = 'bug-anexos'

const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60

export class SupabaseStorageRepository implements IStorageRepository {
  async uploadBugAnexo(file: File): Promise<string> {
    const path = `${crypto.randomUUID()}-${file.name}`
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
