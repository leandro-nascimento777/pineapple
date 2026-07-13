import { FunctionsHttpError } from '@supabase/supabase-js'
import type { IUserPasswordGateway, ResetUserPasswordData } from '../../domain/repositories/IUserPasswordGateway'
import { supabase } from './client'

export class SupabaseUserPasswordGateway implements IUserPasswordGateway {
  async resetPassword(data: ResetUserPasswordData): Promise<void> {
    const { error } = await supabase.functions.invoke('admin-reset-user-password', {
      body: data,
    })

    if (error) {
      if (error instanceof FunctionsHttpError) {
        const body = await error.context.json().catch(() => null)
        throw new Error(body?.error ?? error.message)
      }
      throw error
    }
  }
}
