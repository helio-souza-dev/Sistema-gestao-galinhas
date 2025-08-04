// Configuração da API - VERSÃO CORRIGIDA
export const API_CONFIG = {
  // CAMINHO CORRETO - galinha-gestao-sistema (não galinha-gestao)
  BASE_URL: "http://localhost/galinha-gestao-sistema/api",
}

// Função para fazer requisições com tratamento de erro melhorado
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`

  // Log para debug - vamos ver qual URL está sendo usada
  console.log("🔍 URL sendo acessada:", url)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    })

    // Verificar se a resposta é válida
    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Erro HTTP:", response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      console.log("✅ Dados recebidos:", data)
      return data
    } else {
      const text = await response.text()
      console.error("❌ Resposta não é JSON:", text)
      throw new Error(`Resposta não é JSON: ${text}`)
    }
  } catch (error) {
    console.error("💥 Erro completo:", error)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Não foi possível conectar com a API em ${url}. Verifique se o WAMP está rodando e a API está acessível.`,
      )
    }
    throw error
  }
}
