import { AssumeBug } from '../domain/use-cases/AssumeBug'
import { CreateBug } from '../domain/use-cases/CreateBug'
import { CreateCompany } from '../domain/use-cases/CreateCompany'
import { CreateProject } from '../domain/use-cases/CreateProject'
import { CreateSetor } from '../domain/use-cases/CreateSetor'
import { GetBugAnexoUrl } from '../domain/use-cases/GetBugAnexoUrl'
import { InviteUser } from '../domain/use-cases/InviteUser'
import { ListBugsByProject } from '../domain/use-cases/ListBugsByProject'
import { ListCompanies } from '../domain/use-cases/ListCompanies'
import { ListProfiles } from '../domain/use-cases/ListProfiles'
import { ListProjectsByCompany } from '../domain/use-cases/ListProjectsByCompany'
import { ListSetoresByCompany } from '../domain/use-cases/ListSetoresByCompany'
import { ResolveAccessByProfile } from '../domain/use-cases/ResolveAccessByProfile'
import { ResolveBug } from '../domain/use-cases/ResolveBug'
import { SubscribeToBugUpdates } from '../domain/use-cases/SubscribeToBugUpdates'
import { UpdateProfile } from '../domain/use-cases/UpdateProfile'
import { SupabaseBugRepository } from './supabase/SupabaseBugRepository'
import { SupabaseCompanyRepository } from './supabase/SupabaseCompanyRepository'
import { SupabaseProfileRepository } from './supabase/SupabaseProfileRepository'
import { SupabaseProjectRepository } from './supabase/SupabaseProjectRepository'
import { SupabaseSetorRepository } from './supabase/SupabaseSetorRepository'
import { SupabaseStorageRepository } from './supabase/SupabaseStorageRepository'
import { SupabaseUserInvitationGateway } from './supabase/SupabaseUserInvitationGateway'

const bugRepository = new SupabaseBugRepository()
const companyRepository = new SupabaseCompanyRepository()
const profileRepository = new SupabaseProfileRepository()
const projectRepository = new SupabaseProjectRepository()
const setorRepository = new SupabaseSetorRepository()
const storageRepository = new SupabaseStorageRepository()
const userInvitationGateway = new SupabaseUserInvitationGateway()

export const assumeBug = new AssumeBug(bugRepository)
export const createBug = new CreateBug(bugRepository, storageRepository)
export const createCompany = new CreateCompany(companyRepository)
export const createProject = new CreateProject(projectRepository)
export const createSetor = new CreateSetor(setorRepository)
export const getBugAnexoUrl = new GetBugAnexoUrl(storageRepository)
export const inviteUser = new InviteUser(userInvitationGateway)
export const resolveBug = new ResolveBug(bugRepository)
export const listBugsByProject = new ListBugsByProject(bugRepository)
export const listCompanies = new ListCompanies(companyRepository)
export const listProfiles = new ListProfiles(profileRepository)
export const listProjectsByCompany = new ListProjectsByCompany(projectRepository)
export const listSetoresByCompany = new ListSetoresByCompany(setorRepository)
export const resolveAccessByProfile = new ResolveAccessByProfile(profileRepository, companyRepository)
export const subscribeToBugUpdates = new SubscribeToBugUpdates(bugRepository)
export const updateProfile = new UpdateProfile(profileRepository)
