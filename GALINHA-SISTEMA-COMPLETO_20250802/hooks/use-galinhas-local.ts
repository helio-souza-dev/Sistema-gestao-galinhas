"use client"

import { useState, useEffect } from "react"
import { apiRequest } from "@/lib/config"

interface Galinha {
  id: number
  codigo_barras: string
  nome: string
  raca: string
  idade: number
  status: "ativa" | "doente" | "vendida"
  producao_semanal: number
  data_aquisicao: string
  created_at: string
  updated_at: string
}

interface NovaGalinha {
  codigo_barras: string
  nome: string
  raca: string
  idade: number
  status?: "ativa" | "doente" | "vendida"
  producao_semanal?: number
  data_aquisicao: string
}

interface AtualizarGalinha {
  nome?: string
  raca?: string
  idade?: number
  status?: "ativa" | "doente" | "vendida"
  producao_semanal?: number
  data_aquisicao?: string
}

export function useGalinhasLocal() {
  const [galinhas, setGalinhas] = useState<Galinha[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar galinhas
  const carregarGalinhas = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await apiRequest("/galinhas/")
      setGalinhas(Array.isArray(data) ? data : [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar galinhas"
      setError(errorMessage)
      console.error("Erro ao carregar galinhas:", err)

      // Se não conseguir carregar, usar dados mock para desenvolvimento
      console.warn("Usando dados mock devido ao erro de conexão")
      setGalinhas([
        {
          id: 1,
          codigo_barras: "GAL001",
          nome: "Galinha Mock 1",
          raca: "Rhode Island Red",
          idade: 8,
          status: "ativa",
          producao_semanal: 6,
          data_aquisicao: "2024-01-15",
          created_at: "2024-01-15 10:00:00",
          updated_at: "2024-01-15 10:00:00",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Adicionar galinha
  const adicionarGalinha = async (novaGalinha: NovaGalinha) => {
    try {
      const data = await apiRequest("/galinhas/", {
        method: "POST",
        body: JSON.stringify(novaGalinha),
      })

      await carregarGalinhas() // Recarregar lista
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao adicionar galinha"
      setError(message)
      return { success: false, error: message }
    }
  }

  // Atualizar galinha
  const atualizarGalinha = async (id: number, updates: AtualizarGalinha) => {
    try {
      const data = await apiRequest("/galinhas/", {
        method: "PUT",
        body: JSON.stringify({ id, ...updates }),
      })

      await carregarGalinhas() // Recarregar lista
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar galinha"
      setError(message)
      return { success: false, error: message }
    }
  }

  // Remover galinha
  const removerGalinha = async (id: number) => {
    try {
      await apiRequest("/galinhas/", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      })

      await carregarGalinhas() // Recarregar lista
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
      const data = await apiRequest(`/galinhas/?codigo_barras=${encodeURIComponent(codigo.toUpperCase())}`)
      return data
    } catch (err) {
      console.error("Erro ao buscar por código:", err)
      return null
    }
  }

  // Gerar próximo código de barras
  const gerarProximoCodigo = async () => {
    try {
      const data = await apiRequest("/galinhas/?next_code=1")
      return data.codigo
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
