"use client"

import { useState, useEffect } from "react"
import { apiRequest } from "@/lib/config"

interface Transacao {
  id: number
  tipo: "gasto" | "ganho"
  categoria: string
  valor: number
  descricao: string | null
  data: string
  created_at: string
  updated_at: string
}

interface NovaTransacao {
  tipo: "gasto" | "ganho"
  categoria: string
  valor: number
  descricao?: string | null
  data: string
}

export function useTransacoesLocal() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar transações
  const carregarTransacoes = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await apiRequest("/transacoes/")
      setTransacoes(Array.isArray(data) ? data : [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao carregar transações"
      setError(errorMessage)
      console.error("Erro ao carregar transações:", err)

      // Se não conseguir carregar, usar dados mock para desenvolvimento
      console.warn("Usando dados mock devido ao erro de conexão")
      setTransacoes([
        {
          id: 1,
          tipo: "gasto",
          categoria: "Ração",
          valor: 150.0,
          descricao: "Ração para 1 mês",
          data: "2024-12-01",
          created_at: "2024-12-01 10:00:00",
          updated_at: "2024-12-01 10:00:00",
        },
        {
          id: 2,
          tipo: "ganho",
          categoria: "Ovos",
          valor: 200.0,
          descricao: "Venda de 100 ovos",
          data: "2024-12-05",
          created_at: "2024-12-05 10:00:00",
          updated_at: "2024-12-05 10:00:00",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Adicionar transação
  const adicionarTransacao = async (novaTransacao: NovaTransacao) => {
    try {
      const data = await apiRequest("/transacoes/", {
        method: "POST",
        body: JSON.stringify(novaTransacao),
      })

      await carregarTransacoes() // Recarregar lista
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao adicionar transação"
      setError(message)
      return { success: false, error: message }
    }
  }

  // Remover transação
  const removerTransacao = async (id: number) => {
    try {
      await apiRequest("/transacoes/", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      })

      await carregarTransacoes() // Recarregar lista
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
