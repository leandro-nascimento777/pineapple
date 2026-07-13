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

  let userId: string, password: string
  try {
    const body = await req.json()
    userId = body.userId
    password = body.password
  } catch {
    return json({ error: "JSON inválido" }, 400)
  }

  if (!userId || !password) {
    return json({ error: "userId e password são obrigatórios" }, 400)
  }
  if (password.length < 6) {
    return json({ error: "A senha precisa ter pelo menos 6 caracteres" }, 400)
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
    return json({ error: "Apenas admins podem redefinir senhas" }, 403)
  }

  // client com service role: só ele pode chamar a Admin API de auth
  const adminClient = createClient(supabaseUrl, serviceRoleKey)

  const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, { password })
  if (updateError) {
    return json({ error: updateError.message }, updateError.status ?? 400)
  }

  return json({ ok: true }, 200)
})
