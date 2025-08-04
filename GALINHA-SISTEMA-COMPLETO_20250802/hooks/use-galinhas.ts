"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

type Galinha = Database["public"]["Tables"]["galinhas"]["Row"]
type NovaGalinha = Database["public"]["Tables"]["galinhas"]["Insert"]
type AtualizarGalinha = Database["public"]["Tables"]["galinhas"]["Update"]

export function useGalinhas() {
  const [galinhas, setGalinhas] = useState<Galinha[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar galinhas
  const carregarGalinhas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("galinhas").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setGalinhas(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar galinhas")
    } finally {
      setLoading(false)
    }
  }

  // Adicionar galinha
  const adicionarGalinha = async (novaGalinha: NovaGalinha) => {
    try {
      const { data, error } = await supabase.from("galinhas").insert([novaGalinha]).select().single()

      if (error) throw error
      setGalinhas((prev) => [data, ...prev])
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao adicionar galinha"
      setError(message)
      return { success: false, error: message }
    }
  }

  // Atualizar galinha
  const atualizarGalinha = async (id: string, updates: AtualizarGalinha) => {
    try {
      const { data, error } = await supabase.from("galinhas").update(updates).eq("id", id).select().single()

      if (error) throw error
      setGalinhas((prev) => prev.map((g) => (g.id === id ? data : g)))
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar galinha"
      setError(message)
      return { success: false, error: message }
    }
  }

  // Remover galinha
  const removerGalinha = async (id: string) => {
    try {
      const { error } = await supabase.from("galinhas").delete().eq("id", id)

      if (error) throw error
      setGalinhas((prev) => prev.filter((g) => g.id !== id))
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao remover galinha"
      setError(message)
      return { success: false, error: message }
    }
  }

  // Buscar por código de barras
  const buscarPorCodigoBarras = async (codigo: string) => {
    try {
      const { data, error } = await supabase
        .from("galinhas")
        .select("*")
        .eq("codigo_barras", codigo.toUpperCase())
        .single()

      if (error && error.code !== "PGRST116") throw error
      return data
    } catch (err) {
      console.error("Erro ao buscar por código:", err)
      return null
    }
  }

  // Gerar próximo código de barras
  const gerarProximoCodigo = async () => {
    try {
      const { data, error } = await supabase
        .from("galinhas")
        .select("codigo_barras")
        .order("codigo_barras", { ascending: false })
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        const ultimoCodigo = data[0].codigo_barras
        const numero = Number.parseInt(ultimoCodigo.replace("GAL", "")) + 1
        return `GAL${numero.toString().padStart(3, "0")}`
      }

      return "GAL001"
    } catch (err) {
      console.error("Erro ao gerar código:", err)
      return `GAL${Date.now().toString().slice(-3)}`
    }
  }

  useEffect(() => {
    carregarGalinhas()
  }, [])

  return {
    galinhas,
    loading,
    error,
    carregarGalinhas,
    adicionarGalinha,
    atualizarGalinha,
    removerGalinha,
    buscarPorCodigoBarras,
    gerarProximoCodigo,
  }
}
