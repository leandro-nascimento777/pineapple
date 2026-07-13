import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}

type Role = "admin" | "dev" | "user"

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  const authHeader = req.headers.get("Authorization")
  if (!authHeader) {
    return json({ error: "Missing Authorization header" }, 401)
  }

  let email: string, name: string, password: string, role: Role, companyId: string | undefined, projectIds: string[] | undefined
  try {
    const body = await req.json()
    email = body.email
    name = body.name
    password = body.password
    role = body.role
    companyId = body.companyId
    projectIds = body.projectIds
  } catch {
    return json({ error: "JSON inválido" }, 400)
  }

  if (!email || !name || !password || !role || !["admin", "dev", "user"].includes(role)) {
    return json({ error: "email, name, password e role (admin|dev|user) são obrigatórios" }, 400)
  }
  if (password.length < 6) {
    return json({ error: "A senha precisa ter pelo menos 6 caracteres" }, 400)
  }
  if (role === "user" && (!companyId || !projectIds || projectIds.length === 0)) {
    return json({ error: "usuário precisa de companyId e ao menos um projeto" }, 400)
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

  // client autenticado como quem chamou, só pra confirmar que é admin
  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })

  const { data: isAdmin, error: isAdminError } = await callerClient.rpc("is_admin")
  if (isAdminError || !isAdmin) {
    return json({ error: "Apenas admins podem convidar usuários" }, 403)
  }

  // client com service role: só ele pode chamar a Admin API de auth
  const adminClient = createClient(supabaseUrl, serviceRoleKey)

  const { data: invited, error: inviteError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (inviteError || !invited.user) {
    return json({ error: inviteError?.message ?? "Falha ao criar usuário" }, inviteError?.status ?? 400)
  }

  // a linha em profiles já existe (criada pelo trigger on_auth_user_created
  // com role='pending'); aqui só atribuímos role/empresa/nome de verdade.
  const { error: profileError } = await adminClient
    .from("profiles")
    .update({ role, company_id: role === "user" ? companyId : null, name })
    .eq("id", invited.user.id)

  if (profileError) {
    return json({ error: profileError.message }, 500)
  }

  if (role === "user" && projectIds) {
    const { error: projectsError } = await adminClient
      .from("profile_projects")
      .insert(projectIds.map((projectId) => ({ profile_id: invited.user.id, project_id: projectId })))

    if (projectsError) {
      return json({ error: projectsError.message }, 500)
    }
  }

  return json({ userId: invited.user.id }, 200)
})
