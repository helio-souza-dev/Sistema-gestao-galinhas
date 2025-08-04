"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

type Transacao = Database["public"]["Tables"]["transacoes"]["Row"]
type NovaTransacao = Database["public"]["Tables"]["transacoes"]["Insert"]

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar transações
  const carregarTransacoes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("transacoes").select("*").order("data", { ascending: false })

      if (error) throw error
      setTransacoes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar transações")
    } finally {
      setLoading(false)
    }
  }

  // Adicionar transação
  const adicionarTransacao = async (novaTransacao: NovaTransacao) => {
    try {
      const { data, error } = await supabase.from("transacoes").insert([novaTransacao]).select().single()

      if (error) throw error
      setTransacoes((prev) => [data, ...prev])
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao adicionar transação"
      setError(message)
      return { success: false, error: message }
    }
  }

  // Remover transação
  const removerTransacao = async (id: string) => {
    try {
      const { error } = await supabase.from("transacoes").delete().eq("id", id)

      if (error) throw error
      setTransacoes((prev) => prev.filter((t) => t.id !== id))
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao remover transação"
      setError(message)
      return { success: false, error: message }
    }
  }

  useEffect(() => {
    carregarTransacoes()
  }, [])

  return {
    transacoes,
    loading,
    error,
    carregarTransacoes,
    adicionarTransacao,
    removerTransacao,
  }
}
