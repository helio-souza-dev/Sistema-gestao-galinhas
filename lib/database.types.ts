export type Database = {
  public: {
    Tables: {
      galinhas: {
        Row: {
          id: string
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
        Insert: {
          id?: string
          codigo_barras: string
          nome: string
          raca: string
          idade: number
          status?: "ativa" | "doente" | "vendida"
          producao_semanal?: number
          data_aquisicao: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          codigo_barras?: string
          nome?: string
          raca?: string
          idade?: number
          status?: "ativa" | "doente" | "vendida"
          producao_semanal?: number
          data_aquisicao?: string
          updated_at?: string
        }
      }
      transacoes: {
        Row: {
          id: string
          tipo: "gasto" | "ganho"
          categoria: string
          valor: number
          descricao: string | null
          data: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tipo: "gasto" | "ganho"
          categoria: string
          valor: number
          descricao?: string | null
          data: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tipo?: "gasto" | "ganho"
          categoria?: string
          valor?: number
          descricao?: string | null
          data?: string
          updated_at?: string
        }
      }
    }
  }
}
