import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Verificar se as variáveis de ambiente existem
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Singleton pattern para evitar múltiplas instâncias
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export function getSupabase() {
  // Se não tiver as credenciais, retornar null (modo offline)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Credenciais do Supabase não encontradas. Sistema funcionará em modo offline.")
    return null
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false, // Desabilitar auth para este projeto
        },
      })
    } catch (error) {
      console.error("❌ Erro ao criar cliente Supabase:", error)
      return null
    }
  }
  return supabaseInstance
}

export const supabase = getSupabase()
