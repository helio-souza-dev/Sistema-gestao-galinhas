"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, WifiOff, RefreshCw } from "lucide-react"

interface StatusConexaoProps {
  usingMockData: boolean
  connectionStatus: "checking" | "connected" | "offline"
  error?: string | null
  onReconnect?: () => void
}

export function StatusConexao({ usingMockData, connectionStatus, error, onReconnect }: StatusConexaoProps) {
  if (connectionStatus === "checking") {
    return (
      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
        <div className="flex-1">
          <span className="text-yellow-700 text-sm font-medium">Verificando conexão...</span>
          <p className="text-yellow-600 text-xs">Testando conexão com o banco de dados</p>
        </div>
        <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
          Conectando
        </Badge>
      </div>
    )
  }

  if (usingMockData) {
    return (
      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <WifiOff className="h-4 w-4 text-blue-600" />
        <div className="flex-1">
          <span className="text-blue-700 text-sm font-medium">Modo Demonstração</span>
          <p className="text-blue-600 text-xs">
            {error ? error : "Sistema funcionando com dados locais. Configure o Supabase para usar banco real."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onReconnect && (
            <Button variant="outline" size="sm" onClick={onReconnect}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Tentar Conectar
            </Button>
          )}
          <Badge variant="outline" className="bg-blue-100 text-blue-700">
            Demo
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
      <Database className="h-4 w-4 text-green-600" />
      <div className="flex-1">
        <span className="text-green-700 text-sm font-medium">✅ Conectado ao Supabase</span>
        <p className="text-green-600 text-xs">Dados salvos no banco de dados em tempo real</p>
      </div>
      <Badge variant="outline" className="bg-green-100 text-green-700">
        Online
      </Badge>
    </div>
  )
}
