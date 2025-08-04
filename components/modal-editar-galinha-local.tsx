"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

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

interface ModalEditarGalinhaLocalProps {
  galinha: Galinha | null
  aberto: boolean
  onClose: () => void
  onSave: (id: number, updates: any) => Promise<{ success: boolean; error?: string }>
}

export function ModalEditarGalinhaLocal({ galinha, aberto, onClose, onSave }: ModalEditarGalinhaLocalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    raca: "",
    idade: "",
    producaoSemanal: "",
    status: "ativa" as "ativa" | "doente" | "vendida",
    dataAquisicao: new Date(),
  })
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (galinha) {
      setFormData({
        nome: galinha.nome,
        raca: galinha.raca,
        idade: galinha.idade.toString(),
        producaoSemanal: galinha.producao_semanal.toString(),
        status: galinha.status,
        dataAquisicao: new Date(galinha.data_aquisicao),
      })
    }
  }, [galinha])

  const handleSave = async () => {
    if (!galinha) return

    setSalvando(true)
    try {
      const updates = {
        nome: formData.nome,
        raca: formData.raca,
        idade: Number.parseInt(formData.idade),
        producao_semanal: Number.parseInt(formData.producaoSemanal),
        status: formData.status,
        data_aquisicao: format(formData.dataAquisicao, "yyyy-MM-dd"),
      }

      const result = await onSave(galinha.id, updates)
      if (result.success) {
        onClose()
      }
    } finally {
      setSalvando(false)
    }
  }

  const handleClose = () => {
    if (!salvando) {
      onClose()
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Galinha</DialogTitle>
          <DialogDescription>Edite as informações da galinha {galinha?.codigo_barras}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-nome">Nome</Label>
              <Input
                id="edit-nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome da galinha"
              />
            </div>
            <div>
              <Label htmlFor="edit-raca">Raça</Label>
              <Select value={formData.raca} onValueChange={(value) => setFormData({ ...formData, raca: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a raça" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rhode Island Red">Rhode Island Red</SelectItem>
                  <SelectItem value="Leghorn">Leghorn</SelectItem>
                  <SelectItem value="Sussex">Sussex</SelectItem>
                  <SelectItem value="Orpington">Orpington</SelectItem>
                  <SelectItem value="Caipira">Caipira</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-idade">Idade (meses)</Label>
              <Input
                id="edit-idade"
                type="number"
                value={formData.idade}
                onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                placeholder="Idade em meses"
              />
            </div>
            <div>
              <Label htmlFor="edit-producao">Produção Semanal</Label>
              <Input
                id="edit-producao"
                type="number"
                value={formData.producaoSemanal}
                onChange={(e) => setFormData({ ...formData, producaoSemanal: e.target.value })}
                placeholder="Ovos por semana"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "ativa" | "doente" | "vendida") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="doente">Doente</SelectItem>
                  <SelectItem value="vendida">Vendida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data de Aquisição</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.dataAquisicao, "dd/MM/yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dataAquisicao}
                    onSelect={(date) => date && setFormData({ ...formData, dataAquisicao: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose} disabled={salvando}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={salvando}>
            <Save className="mr-2 h-4 w-4" />
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
