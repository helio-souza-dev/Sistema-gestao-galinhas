"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"

interface CodigoBarrasProps {
  codigo: string
  nome?: string
}

export function CodigoBarras({ codigo, nome }: CodigoBarrasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Configurações do código de barras
        const barWidth = 3
        const barHeight = 60
        const startX = 20
        const startY = 20

        // Simular padrão de código de barras baseado no código
        let x = startX
        for (let i = 0; i < codigo.length; i++) {
          const charCode = codigo.charCodeAt(i)
          const pattern = charCode % 2 === 0 ? [1, 0, 1, 1, 0] : [0, 1, 0, 0, 1]

          pattern.forEach((bar) => {
            if (bar === 1) {
              ctx.fillStyle = "#000000"
              ctx.fillRect(x, startY, barWidth, barHeight)
            }
            x += barWidth
          })
          x += barWidth // Espaço entre caracteres
        }

        // Adicionar texto do código
        ctx.fillStyle = "#000000"
        ctx.font = "14px monospace"
        ctx.textAlign = "center"
        ctx.fillText(codigo, canvas.width / 2, startY + barHeight + 20)

        if (nome) {
          ctx.font = "12px Arial"
          ctx.fillText(nome, canvas.width / 2, startY + barHeight + 40)
        }
      }
    }
  }, [codigo, nome])

  const imprimirCodigo = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        const dataUrl = canvas.toDataURL()
        printWindow.document.write(`
          <html>
            <head>
              <title>Código de Barras - ${codigo}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 20px;
                  margin: 0;
                }
                img {
                  max-width: 100%;
                  height: auto;
                }
                .info {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <h3>Sistema de Gestão de Galinhas</h3>
              <img src="${dataUrl}" alt="Código de Barras ${codigo}" />
              <div class="info">
                <p>Cole este código na galinha para identificação</p>
                <p>Data: ${new Date().toLocaleDateString("pt-BR")}</p>
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const baixarCodigo = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const link = document.createElement("a")
      link.download = `codigo-barras-${codigo}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Código de Barras</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <canvas ref={canvasRef} width={300} height={120} className="border border-gray-200 rounded" />
        </div>

        <div className="flex gap-2 justify-center">
          <Button onClick={imprimirCodigo} variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={baixarCodigo} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Baixar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
