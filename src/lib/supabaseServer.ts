import { createClient } from '@supabase/supabase-js'

// ⚠️ IMPORTANT: Never expose service_role on the client.
// Usa estas keys solo en server-side code o en rutas API.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Public client (anon) → can be used in frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Admin client (service_role) → ONLY on server-side
// If no service_role key, use anon client as fallback
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    })
  : supabase
