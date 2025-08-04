"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Bug, Database, Wifi } from "lucide-react"

interface DebugPanelProps {
  usingMockData: boolean
  connectionStatus: "checking" | "connected" | "offline"
  error?: string | null
  galinhasCount: number
  transacoesCount: number
  onReconnect?: () => void
}

export function DebugPanel({
  usingMockData,
  connectionStatus,
  error,
  galinhasCount,
  transacoesCount,
  onReconnect,
}: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hasSupabaseEnv = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-medium mb-1">Status da Conexão:</p>
              <Badge variant={connectionStatus === "connected" ? "default" : "secondary"}>{connectionStatus}</Badge>
            </div>

            <div>
              <p className="font-medium mb-1">Modo de Dados:</p>
              <Badge variant={usingMockData ? "outline" : "default"}>{usingMockData ? "Mock" : "Supabase"}</Badge>
            </div>

            <div>
              <p className="font-medium mb-1">Variáveis Env:</p>
              <Badge variant={hasSupabaseEnv ? "default" : "destructive"}>
                {hasSupabaseEnv ? "Configuradas" : "Faltando"}
              </Badge>
            </div>

            <div>
              <p className="font-medium mb-1">Dados Carregados:</p>
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs">
                  {galinhasCount} galinhas
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {transacoesCount} transações
                </Badge>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
              <p className="font-medium text-red-800 mb-1">Último Erro:</p>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            {onReconnect && (
              <Button variant="outline" size="sm" onClick={onReconnect}>
                <Database className="h-3 w-3 mr-1" />
                Reconectar
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <Wifi className="h-3 w-3 mr-1" />
              Recarregar
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>
              <strong>Supabase URL:</strong>{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configurada" : "❌ Não configurada"}
            </p>
            <p>
              <strong>Supabase Key:</strong>{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Configurada" : "❌ Não configurada"}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
