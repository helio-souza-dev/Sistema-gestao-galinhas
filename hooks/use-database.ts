"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import type { Database } from "@/lib/database.types"

type Galinha = Database["public"]["Tables"]["galinhas"]["Row"]
type NovaGalinha = Database["public"]["Tables"]["galinhas"]["Insert"]
type AtualizarGalinha = Database["public"]["Tables"]["galinhas"]["Update"]

type Transacao = Database["public"]["Tables"]["transacoes"]["Row"]
type NovaTransacao = Database["public"]["Tables"]["transacoes"]["Insert"]

// Dados mock como fallback
const mockGalinhas: Galinha[] = [
  {
    id: "mock-1",
    codigo_barras: "GAL001",
    nome: "Galinha Demo 1",
    raca: "Rhode Island Red",
    idade: 8,
    status: "ativa",
    producao_semanal: 6,
    data_aquisicao: "2024-01-15",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "mock-2",
    codigo_barras: "GAL002",
    nome: "Galinha Demo 2",
    raca: "Leghorn",
    idade: 6,
    status: "ativa",
    producao_semanal: 7,
    data_aquisicao: "2024-02-01",
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z",
  },
]

const mockTransacoes: Transacao[] = [
  {
    id: "mock-1",
    tipo: "gasto",
    categoria: "Ração",
    valor: 150.0,
    descricao: "Ração para 1 mês (Demo)",
    data: "2024-12-01",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2024-12-01T10:00:00Z",
  },
  {
    id: "mock-2",
    tipo: "ganho",
    categoria: "Ovos",
    valor: 200.0,
    descricao: "Venda de 100 ovos (Demo)",
    data: "2024-12-05",
    created_at: "2024-12-05T10:00:00Z",
    updated_at: "2024-12-05T10:00:00Z",
  },
]

export function useDatabase() {
  const [galinhas, setGalinhas] = useState<Galinha[]>([])
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "offline">("checking")

  // Testar conexão com Supabase de forma mais robusta
  const testarConexao = async (): Promise<boolean> => {
    try {
      console.log("🔍 Testando conexão com Supabase...")

      if (!supabase) {
        console.log("❌ Cliente Supabase não inicializado")
        return false
      }

      // Tentar uma operação simples no banco
      const { data, error } = await supabase.from("galinhas").select("id").limit(1)

      if (error) {
        console.error("❌ Erro na consulta Supabase:", error)
        return false
      }

      console.log("✅ Conexão com Supabase OK!")
      return true
    } catch (err) {
      console.error("❌ Erro de conexão:", err)
      return false
    }
  }

  // Carregar dados do Supabase
  const carregarDadosSupabase = async () => {
    try {
      console.log("📥 Carregando dados do Supabase...")

      // Carregar galinhas
      const { data: galinhasData, error: galinhasError } = await supabase!
        .from("galinhas")
        .select("*")
        .order("created_at", { ascending: false })

      if (galinhasError) {
        console.error("❌ Erro ao carregar galinhas:", galinhasError)
        throw galinhasError
      }

      // Carregar transações
      const { data: transacoesData, error: transacoesError } = await supabase!
        .from("transacoes")
        .select("*")
        .order("data", { ascending: false })

      if (transacoesError) {
        console.error("❌ Erro ao carregar transações:", transacoesError)
        throw transacoesError
      }

      console.log("✅ Dados carregados do Supabase:", {
        galinhas: galinhasData?.length || 0,
        transacoes: transacoesData?.length || 0,
      })

      setGalinhas(galinhasData || [])
      setTransacoes(transacoesData || [])
      setUsingMockData(false)
      setConnectionStatus("connected")
      setError(null)
    } catch (err) {
      console.error("❌ Erro ao carregar dados do Supabase:", err)
      throw err
    }
  }

  // Carregar dados mock
  const carregarDadosMock = () => {
    console.log("🔄 Carregando dados mock...")
    setGalinhas(mockGalinhas)
    setTransacoes(mockTransacoes)
    setUsingMockData(true)
    setConnectionStatus("offline")
  }

  // Carregar dados iniciais
  const carregarDados = async () => {
    try {
      setLoading(true)
      setError(null)
      setConnectionStatus("checking")

      // Verificar se Supabase está configurado
      if (!supabase) {
        console.log("⚠️ Supabase não configurado - usando dados mock")
        carregarDadosMock()
        return
      }

      // Testar conexão
      const conexaoOk = await testarConexao()

      if (conexaoOk) {
        // Tentar carregar dados reais
        await carregarDadosSupabase()
      } else {
        // Usar dados mock como fallback
        console.log("⚠️ Falha na conexão - usando dados mock")
        carregarDadosMock()
        setError("Não foi possível conectar ao banco de dados. Usando modo demonstração.")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      console.error("❌ Erro geral ao carregar dados:", err)

      // Fallback para dados mock
      carregarDadosMock()
      setError(`Erro de conexão: ${errorMessage}. Usando modo demonstração.`)
    } finally {
      setLoading(false)
    }
  }

  // CRUD Galinhas
  const adicionarGalinha = async (novaGalinha: NovaGalinha) => {
    try {
      console.log("➕ Adicionando galinha:", novaGalinha)

      if (usingMockData || !supabase) {
        // Modo mock
        console.log("📝 Modo mock - adicionando localmente")
        const novoId = `mock-${Date.now()}`
        const galinhaCompleta: Galinha = {
          ...novaGalinha,
          id: novoId,
          status: novaGalinha.status || "ativa",
          producao_semanal: novaGalinha.producao_semanal || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setGalinhas((prev) => [galinhaCompleta, ...prev])
        return { success: true, data: galinhaCompleta }
      }

      // Modo banco de dados
      console.log("💾 Salvando no Supabase...")
      const { data, error } = await supabase.from("galinhas").insert([novaGalinha]).select().single()

      if (error) {
        console.error("❌ Erro ao inserir no Supabase:", error)
        throw error
      }

      console.log("✅ Galinha salva no Supabase:", data)
      setGalinhas((prev) => [data, ...prev])
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao adicionar galinha"
      console.error("❌ Erro ao adicionar galinha:", err)
      setError(message)
      return { success: false, error: message }
    }
  }

  const atualizarGalinha = async (id: string, updates: AtualizarGalinha) => {
    try {
      console.log("✏️ Atualizando galinha:", id, updates)

      if (usingMockData || !supabase) {
        // Modo mock
        console.log("📝 Modo mock - atualizando localmente")
        setGalinhas((prev) =>
          prev.map((g) => (g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g)),
        )
        return { success: true }
      }

      // Modo banco de dados
      console.log("💾 Atualizando no Supabase...")
      const { data, error } = await supabase.from("galinhas").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("❌ Erro ao atualizar no Supabase:", error)
        throw error
      }

      console.log("✅ Galinha atualizada no Supabase:", data)
      setGalinhas((prev) => prev.map((g) => (g.id === id ? data : g)))
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar galinha"
      console.error("❌ Erro ao atualizar galinha:", err)
      setError(message)
      return { success: false, error: message }
    }
  }

  const removerGalinha = async (id: string) => {
    try {
      console.log("🗑️ Removendo galinha:", id)

      if (usingMockData || !supabase) {
        // Modo mock
        console.log("📝 Modo mock - removendo localmente")
        setGalinhas((prev) => prev.filter((g) => g.id !== id))
        return { success: true }
      }

      // Modo banco de dados
      console.log("💾 Removendo do Supabase...")
      const { error } = await supabase.from("galinhas").delete().eq("id", id)

      if (error) {
        console.error("❌ Erro ao remover do Supabase:", error)
        throw error
      }

      console.log("✅ Galinha removida do Supabase")
      setGalinhas((prev) => prev.filter((g) => g.id !== id))
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao remover galinha"
      console.error("❌ Erro ao remover galinha:", err)
      setError(message)
      return { success: false, error: message }
    }
  }

  const buscarPorCodigoBarras = async (codigo: string) => {
    try {
      if (usingMockData || !supabase) {
        // Modo mock
        return galinhas.find((g) => g.codigo_barras.toLowerCase() === codigo.toLowerCase()) || null
      }

      // Modo banco de dados
      const { data, error } = await supabase
        .from("galinhas")
        .select("*")
        .eq("codigo_barras", codigo.toUpperCase())
        .single()

      if (error && error.code !== "PGRST116") throw error
      return data || null
    } catch (err) {
      console.error("Erro ao buscar por código:", err)
      return null
    }
  }

  const gerarProximoCodigo = async () => {
    try {
      if (usingMockData || !supabase) {
        // Modo mock
        const numeros = galinhas
          .map((g) => Number.parseInt(g.codigo_barras.replace("GAL", "")))
          .filter((n) => !isNaN(n))
        const proximoNumero = numeros.length > 0 ? Math.max(...numeros) + 1 : 1
        return `GAL${proximoNumero.toString().padStart(3, "0")}`
      }

      // Modo banco de dados
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

  // CRUD Transações
  const adicionarTransacao = async (novaTransacao: NovaTransacao) => {
    try {
      console.log("➕ Adicionando transação:", novaTransacao)

      if (usingMockData || !supabase) {
        // Modo mock
        console.log("📝 Modo mock - adicionando transação localmente")
        const novoId = `mock-${Date.now()}`
        const transacaoCompleta: Transacao = {
          ...novaTransacao,
          id: novoId,
          descricao: novaTransacao.descricao || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setTransacoes((prev) => [transacaoCompleta, ...prev])
        return { success: true, data: transacaoCompleta }
      }

      // Modo banco de dados
      console.log("💾 Salvando transação no Supabase...")
      const { data, error } = await supabase.from("transacoes").insert([novaTransacao]).select().single()

      if (error) {
        console.error("❌ Erro ao inserir transação no Supabase:", error)
        throw error
      }

      console.log("✅ Transação salva no Supabase:", data)
      setTransacoes((prev) => [data, ...prev])
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao adicionar transação"
      console.error("❌ Erro ao adicionar transação:", err)
      setError(message)
      return { success: false, error: message }
    }
  }

  const removerTransacao = async (id: string) => {
    try {
      console.log("🗑️ Removendo transação:", id)

      if (usingMockData || !supabase) {
        // Modo mock
        console.log("📝 Modo mock - removendo transação localmente")
        setTransacoes((prev) => prev.filter((t) => t.id !== id))
        return { success: true }
      }

      // Modo banco de dados
      console.log("💾 Removendo transação do Supabase...")
      const { error } = await supabase.from("transacoes").delete().eq("id", id)

      if (error) {
        console.error("❌ Erro ao remover transação do Supabase:", error)
        throw error
      }

      console.log("✅ Transação removida do Supabase")
      setTransacoes((prev) => prev.filter((t) => t.id !== id))
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao remover transação"
      console.error("❌ Erro ao remover transação:", err)
      setError(message)
      return { success: false, error: message }
    }
  }

  // Forçar reconexão
  const tentarReconectar = async () => {
    console.log("🔄 Tentando reconectar...")
    await carregarDados()
  }

  useEffect(() => {
    carregarDados()
  }, [])

  return {
    // Dados
    galinhas,
    transacoes,
    loading,
    error,
    usingMockData,
    connectionStatus,

    // Funções de galinhas
    adicionarGalinha,
    atualizarGalinha,
    removerGalinha,
    buscarPorCodigoBarras,
    gerarProximoCodigo,

    // Funções de transações
    adicionarTransacao,
    removerTransacao,

    // Utilitários
    carregarDados,
    testarConexao,
    tentarReconectar,
  }
}
