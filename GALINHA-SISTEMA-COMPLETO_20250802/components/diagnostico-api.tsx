"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from "lucide-react"
import { API_CONFIG } from "@/lib/config"

interface DiagnosticoResult {
  status: string
  message: string
  timestamp: string
  server_info?: any
  database?: any
}

export function DiagnosticoAPI() {
  const [resultado, setResultado] = useState<DiagnosticoResult | null>(null)
  const [testando, setTestando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const testarAPI = async () => {
    setTestando(true)
    setErro(null)
    setResultado(null)

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/test.php`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setResultado(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setErro(errorMessage)
    } finally {
      setTestando(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Diagnóstico da API
        </CardTitle>
        <CardDescription>Teste a conexão com a API PHP local</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button onClick={testarAPI} disabled={testando}>
            {testando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            {testando ? "Testando..." : "Testar API"}
          </Button>
          <Badge variant="outline">{API_CONFIG.BASE_URL}</Badge>
        </div>

        {erro && (
          <div className="p-4 border-2 border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <h3 className="font-semibold text-red-800">Erro de Conexão</h3>
            </div>
            <p className="text-red-700 text-sm">{erro}</p>
            <div className="mt-3 text-xs text-red-600">
              <p>
                <strong>Possíveis soluções:</strong>
              </p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Verifique se o WAMP está rodando</li>
                <li>Confirme se os arquivos PHP estão em C:\wamp64\www\galinha-gestao\</li>
                <li>Teste acessando {API_CONFIG.BASE_URL}/test.php no navegador</li>
                <li>Verifique se o MySQL está ativo no WAMP</li>
              </ul>
            </div>
          </div>
        )}

        {resultado && (
          <div className="space-y-4">
            <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold text-green-800">API Funcionando</h3>
              </div>
              <p className="text-green-700 text-sm">{resultado.message}</p>
              <p className="text-green-600 text-xs mt-1">Testado em: {resultado.timestamp}</p>
            </div>

            {resultado.server_info && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Informações do Servidor</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>PHP:</strong> {resultado.server_info.php_version}
                  </p>
                  <p>
                    <strong>Servidor:</strong> {resultado.server_info.server_software}
                  </p>
                </div>
              </div>
            )}

            {resultado.database && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Status do Banco de Dados</h4>
                <div className="flex items-center gap-2 mb-2">
                  {resultado.database.status === "connected" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">{resultado.database.message}</span>
                </div>

                {resultado.database.tables && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Tabelas:</p>
                    <div className="flex gap-2">
                      {Object.entries(resultado.database.tables).map(([table, status]) => (
                        <Badge key={table} variant={status === "exists" ? "default" : "destructive"}>
                          {table}: {status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
