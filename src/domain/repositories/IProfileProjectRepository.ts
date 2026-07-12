export interface IProfileProjectRepository {
  listProjectIdsByProfile(profileId: string): Promise<string[]>
  replaceForProfile(profileId: string, projectIds: string[]): Promise<void>
}
