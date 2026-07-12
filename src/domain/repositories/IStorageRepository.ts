export interface IStorageRepository {
  uploadBugAnexo(file: File): Promise<string>
  getBugAnexoUrl(storagePath: string): Promise<string>
}
