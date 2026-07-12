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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  const authHeader = req.headers.get("Authorization")
  if (!authHeader) {
    return json({ error: "Missing Authorization header" }, 401)
  }

  let email: string, name: string, companyId: string
  try {
    const body = await req.json()
    email = body.email
    name = body.name
    companyId = body.companyId
  } catch {
    return json({ error: "JSON inválido" }, 400)
  }

  if (!email || !name || !companyId) {
    return json({ error: "email, name e companyId são obrigatórios" }, 400)
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

  const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email)
  if (inviteError || !invited.user) {
    return json({ error: inviteError?.message ?? "Falha ao convidar usuário" }, 400)
  }

  // a linha em profiles já existe (criada pelo trigger on_auth_user_created
  // com role='pending'); aqui só atribuímos role/empresa/nome de verdade.
  const { error: profileError } = await adminClient
    .from("profiles")
    .update({ role: "user", company_id: companyId, name })
    .eq("id", invited.user.id)

  if (profileError) {
    return json({ error: profileError.message }, 500)
  }

  return json({ userId: invited.user.id }, 200)
})
