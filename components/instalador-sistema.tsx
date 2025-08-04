"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Loader2, Settings, Database } from "lucide-react"
import { API_CONFIG } from "@/lib/config"

interface InstallResult {
  status: string
  message: string
  connection?: string
  database_creation?: string
  table_galinhas?: string
  table_transacoes?: string
  seed_galinhas?: string
  seed_transacoes?: string
  error_details?: any
}

export function InstaladorSistema() {
  const [resultado, setResultado] = useState<InstallResult | null>(null)
  const [instalando, setInstalando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const instalarSistema = async () => {
    setInstalando(true)
    setErro(null)
    setResultado(null)

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/install.php`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setResultado(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setErro(errorMessage)
    } finally {
      setInstalando(false)
    }
  }

  const getStatusIcon = (status: string) => {
    if (status?.startsWith("OK")) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    } else if (status?.startsWith("SKIP")) {
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    } else {
      return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusColor = (status: string) => {
    if (status?.startsWith("OK")) return "text-green-700"
    if (status?.startsWith("SKIP")) return "text-yellow-700"
    return "text-red-700"
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Instalador do Sistema
        </CardTitle>
        <CardDescription>Configure automaticamente o banco de dados e estrutura inicial</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button onClick={instalarSistema} disabled={instalando}>
            {instalando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />}
            {instalando ? "Instalando..." : "Instalar Sistema"}
          </Button>
          <Badge variant="outline">{API_CONFIG.BASE_URL}/install.php</Badge>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">O que será feito:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Conectar ao MySQL do WAMP</li>
            <li>• Criar banco de dados 'galinha_gestao'</li>
            <li>• Criar tabelas 'galinhas' e 'transacoes'</li>
            <li>• Inserir dados de exemplo (se necessário)</li>
          </ul>
        </div>

        {erro && (
          <div className="p-4 border-2 border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <h3 className="font-semibold text-red-800">Erro de Instalação</h3>
            </div>
            <p className="text-red-700 text-sm">{erro}</p>
            <div className="mt-3 text-xs text-red-600">
              <p>
                <strong>Verifique:</strong>
              </p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>WAMP está rodando (ícone verde)</li>
                <li>MySQL está ativo no WAMP</li>
                <li>Pasta está em: C:\wamp64\www\galinha-gestao-sistema\</li>
                <li>Acesse: http://localhost/galinha-gestao-sistema/api/install.php</li>
              </ul>
            </div>
          </div>
        )}

        {resultado && (
          <div className="space-y-4">
            {resultado.status === "SUCCESS" ? (
              <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <h3 className="font-semibold text-green-800">Instalação Concluída!</h3>
                </div>
                <p className="text-green-700 text-sm">{resultado.message}</p>
              </div>
            ) : (
              <div className="p-4 border-2 border-red-200 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <h3 className="font-semibold text-red-800">Erro na Instalação</h3>
                </div>
                <p className="text-red-700 text-sm">{resultado.message}</p>
                {resultado.error_details && (
                  <div className="mt-2 text-xs text-red-600">
                    <p>
                      <strong>Detalhes:</strong> {JSON.stringify(resultado.error_details, null, 2)}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-medium">Detalhes da Instalação:</h4>

              {resultado.connection && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  {getStatusIcon(resultado.connection)}
                  <span className={`text-sm ${getStatusColor(resultado.connection)}`}>
                    <strong>Conexão MySQL:</strong> {resultado.connection}
                  </span>
                </div>
              )}

              {resultado.database_creation && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  {getStatusIcon(resultado.database_creation)}
                  <span className={`text-sm ${getStatusColor(resultado.database_creation)}`}>
                    <strong>Banco de Dados:</strong> {resultado.database_creation}
                  </span>
                </div>
              )}

              {resultado.table_galinhas && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  {getStatusIcon(resultado.table_galinhas)}
                  <span className={`text-sm ${getStatusColor(resultado.table_galinhas)}`}>
                    <strong>Tabela Galinhas:</strong> {resultado.table_galinhas}
                  </span>
                </div>
              )}

              {resultado.table_transacoes && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  {getStatusIcon(resultado.table_transacoes)}
                  <span className={`text-sm ${getStatusColor(resultado.table_transacoes)}`}>
                    <strong>Tabela Transações:</strong> {resultado.table_transacoes}
                  </span>
                </div>
              )}

              {resultado.seed_galinhas && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  {getStatusIcon(resultado.seed_galinhas)}
                  <span className={`text-sm ${getStatusColor(resultado.seed_galinhas)}`}>
                    <strong>Dados Galinhas:</strong> {resultado.seed_galinhas}
                  </span>
                </div>
              )}

              {resultado.seed_transacoes && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  {getStatusIcon(resultado.seed_transacoes)}
                  <span className={`text-sm ${getStatusColor(resultado.seed_transacoes)}`}>
                    <strong>Dados Transações:</strong> {resultado.seed_transacoes}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
