import { AddCompanyDomain } from '../domain/use-cases/AddCompanyDomain'
import { AssumeBug } from '../domain/use-cases/AssumeBug'
import { CreateBug } from '../domain/use-cases/CreateBug'
import { CreateCompany } from '../domain/use-cases/CreateCompany'
import { CreateProject } from '../domain/use-cases/CreateProject'
import { CreateSetor } from '../domain/use-cases/CreateSetor'
import { GetBugAnexoUrl } from '../domain/use-cases/GetBugAnexoUrl'
import { InviteUser } from '../domain/use-cases/InviteUser'
import { ListBugsByCompany } from '../domain/use-cases/ListBugsByCompany'
import { ListBugsByProject } from '../domain/use-cases/ListBugsByProject'
import { ListCompanies } from '../domain/use-cases/ListCompanies'
import { ListCompanyDomains } from '../domain/use-cases/ListCompanyDomains'
import { ListProfiles } from '../domain/use-cases/ListProfiles'
import { ListProjectIdsByProfile } from '../domain/use-cases/ListProjectIdsByProfile'
import { ListProjectsByCompany } from '../domain/use-cases/ListProjectsByCompany'
import { ListSetoresByCompany } from '../domain/use-cases/ListSetoresByCompany'
import { RemoveCompanyDomain } from '../domain/use-cases/RemoveCompanyDomain'
import { ReplaceProfileProjectAccess } from '../domain/use-cases/ReplaceProfileProjectAccess'
import { ResetUserPassword } from '../domain/use-cases/ResetUserPassword'
import { ResolveAccessByProfile } from '../domain/use-cases/ResolveAccessByProfile'
import { ResolveBug } from '../domain/use-cases/ResolveBug'
import { SubscribeToBugUpdates } from '../domain/use-cases/SubscribeToBugUpdates'
import { UpdateProfile } from '../domain/use-cases/UpdateProfile'
import { SupabaseBugRepository } from './supabase/SupabaseBugRepository'
import { SupabaseCompanyDomainRepository } from './supabase/SupabaseCompanyDomainRepository'
import { SupabaseCompanyRepository } from './supabase/SupabaseCompanyRepository'
import { SupabaseProfileProjectRepository } from './supabase/SupabaseProfileProjectRepository'
import { SupabaseProfileRepository } from './supabase/SupabaseProfileRepository'
import { SupabaseProjectRepository } from './supabase/SupabaseProjectRepository'
import { SupabaseSetorRepository } from './supabase/SupabaseSetorRepository'
import { SupabaseStorageRepository } from './supabase/SupabaseStorageRepository'
import { SupabaseUserInvitationGateway } from './supabase/SupabaseUserInvitationGateway'
import { SupabaseUserPasswordGateway } from './supabase/SupabaseUserPasswordGateway'

const bugRepository = new SupabaseBugRepository()
const companyRepository = new SupabaseCompanyRepository()
const companyDomainRepository = new SupabaseCompanyDomainRepository()
const profileRepository = new SupabaseProfileRepository()
const profileProjectRepository = new SupabaseProfileProjectRepository()
const projectRepository = new SupabaseProjectRepository()
const setorRepository = new SupabaseSetorRepository()
const storageRepository = new SupabaseStorageRepository()
const userInvitationGateway = new SupabaseUserInvitationGateway()
const userPasswordGateway = new SupabaseUserPasswordGateway()

export const addCompanyDomain = new AddCompanyDomain(companyDomainRepository)
export const assumeBug = new AssumeBug(bugRepository)
export const createBug = new CreateBug(bugRepository, storageRepository)
export const createCompany = new CreateCompany(companyRepository)
export const createProject = new CreateProject(projectRepository)
export const createSetor = new CreateSetor(setorRepository)
export const getBugAnexoUrl = new GetBugAnexoUrl(storageRepository)
export const inviteUser = new InviteUser(userInvitationGateway)
export const resolveBug = new ResolveBug(bugRepository)
export const listBugsByCompany = new ListBugsByCompany(bugRepository)
export const listBugsByProject = new ListBugsByProject(bugRepository)
export const listCompanies = new ListCompanies(companyRepository)
export const listCompanyDomains = new ListCompanyDomains(companyDomainRepository)
export const listProfiles = new ListProfiles(profileRepository)
export const listProjectIdsByProfile = new ListProjectIdsByProfile(profileProjectRepository)
export const listProjectsByCompany = new ListProjectsByCompany(projectRepository)
export const listSetoresByCompany = new ListSetoresByCompany(setorRepository)
export const removeCompanyDomain = new RemoveCompanyDomain(companyDomainRepository)
export const replaceProfileProjectAccess = new ReplaceProfileProjectAccess(profileProjectRepository)
export const resetUserPassword = new ResetUserPassword(userPasswordGateway)
export const resolveAccessByProfile = new ResolveAccessByProfile(profileRepository, companyRepository)
export const subscribeToBugUpdates = new SubscribeToBugUpdates(bugRepository)
export const updateProfile = new UpdateProfile(profileRepository)
