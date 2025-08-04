"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2, TrendingUp, DollarSign, Egg, QrCode, Scan, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CodigoBarras } from "@/components/codigo-barras"
import { StatusConexao } from "@/components/status-conexao"
import { useToast } from "@/hooks/use-toast"
import { useDatabase } from "@/hooks/use-database"
// Importar o novo componente de debug
import { DebugPanel } from "@/components/debug-panel"

export default function SistemaGalinhas() {
  const { toast } = useToast()

  // Atualizar o hook para incluir connectionStatus
  const {
    galinhas,
    transacoes,
    loading,
    error,
    usingMockData,
    connectionStatus,
    adicionarGalinha,
    atualizarGalinha,
    removerGalinha,
    buscarPorCodigoBarras,
    gerarProximoCodigo,
    adicionarTransacao,
    removerTransacao,
    tentarReconectar,
  } = useDatabase()

  // Estados para formulários
  const [novaGalinha, setNovaGalinha] = useState({
    nome: "",
    raca: "",
    idade: "",
    producaoSemanal: "",
    dataAquisicao: new Date(),
  })

  const [novaTransacao, setNovaTransacao] = useState({
    tipo: "gasto" as "gasto" | "ganho",
    categoria: "",
    valor: "",
    descricao: "",
    data: new Date(),
  })

  const [buscaCodigoBarras, setBuscaCodigoBarras] = useState("")
  const [galinhaEncontrada, setGalinhaEncontrada] = useState<any>(null)
  const [galinhaSelecionada, setGalinhaSelecionada] = useState<any>(null)
  const [adicionandoGalinha, setAdicionandoGalinha] = useState(false)
  const [adicionandoTransacao, setAdicionandoTransacao] = useState(false)

  // Funções para galinhas
  const handleAdicionarGalinha = async () => {
    if (!novaGalinha.nome || !novaGalinha.raca || !novaGalinha.idade) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setAdicionandoGalinha(true)
    try {
      const codigoBarras = await gerarProximoCodigo()
      const result = await adicionarGalinha({
        codigo_barras: codigoBarras,
        nome: novaGalinha.nome,
        raca: novaGalinha.raca,
        idade: Number.parseInt(novaGalinha.idade),
        producao_semanal: Number.parseInt(novaGalinha.producaoSemanal) || 0,
        data_aquisicao: format(novaGalinha.dataAquisicao, "yyyy-MM-dd"),
      })

      if (result.success) {
        setNovaGalinha({
          nome: "",
          raca: "",
          idade: "",
          producaoSemanal: "",
          dataAquisicao: new Date(),
        })
        toast({
          title: "Sucesso",
          description: `Galinha ${result.data?.nome} adicionada com código ${result.data?.codigo_barras}`,
        })
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao adicionar galinha",
          variant: "destructive",
        })
      }
    } finally {
      setAdicionandoGalinha(false)
    }
  }

  const handleRemoverGalinha = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja remover a galinha "${nome}"?`)) {
      const result = await removerGalinha(id)
      if (result.success) {
        toast({
          title: "Sucesso",
          description: `Galinha "${nome}" removida com sucesso`,
        })
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao remover galinha",
          variant: "destructive",
        })
      }
    }
  }

  const handleAtualizarStatus = async (id: string, status: "ativa" | "doente" | "vendida") => {
    const result = await atualizarGalinha(id, { status })
    if (result.success) {
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso",
      })
    } else {
      toast({
        title: "Erro",
        description: result.error || "Erro ao atualizar status",
        variant: "destructive",
      })
    }
  }

  // Funções para transações
  const handleAdicionarTransacao = async () => {
    if (!novaTransacao.categoria || !novaTransacao.valor || !novaTransacao.descricao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setAdicionandoTransacao(true)
    try {
      const result = await adicionarTransacao({
        tipo: novaTransacao.tipo,
        categoria: novaTransacao.categoria,
        valor: Number.parseFloat(novaTransacao.valor),
        descricao: novaTransacao.descricao,
        data: format(novaTransacao.data, "yyyy-MM-dd"),
      })

      if (result.success) {
        setNovaTransacao({
          tipo: "gasto",
          categoria: "",
          valor: "",
          descricao: "",
          data: new Date(),
        })
        toast({
          title: "Sucesso",
          description: `${novaTransacao.tipo === "gasto" ? "Gasto" : "Ganho"} registrado com sucesso`,
        })
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao registrar transação",
          variant: "destructive",
        })
      }
    } finally {
      setAdicionandoTransacao(false)
    }
  }

  const handleRemoverTransacao = async (id: string) => {
    if (confirm("Tem certeza que deseja remover esta transação?")) {
      const result = await removerTransacao(id)
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Transação removida com sucesso",
        })
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao remover transação",
          variant: "destructive",
        })
      }
    }
  }

  const handleBuscarPorCodigo = async () => {
    if (!buscaCodigoBarras.trim()) return

    const galinha = await buscarPorCodigoBarras(buscaCodigoBarras.trim())
    setGalinhaEncontrada(galinha)
  }

  // Cálculos
  const totalGalinhas = galinhas.length
  const galinhasAtivas = galinhas.filter((g) => g.status === "ativa").length
  const producaoSemanalTotal = galinhas
    .filter((g) => g.status === "ativa")
    .reduce((total, g) => total + g.producao_semanal, 0)

  const totalGastos = transacoes.filter((t) => t.tipo === "gasto").reduce((total, t) => total + t.valor, 0)
  const totalGanhos = transacoes.filter((t) => t.tipo === "ganho").reduce((total, t) => total + t.valor, 0)
  const lucroTotal = totalGanhos - totalGastos

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Gestão de Galinhas</h1>
          <p className="text-gray-600">Gerencie seu negócio de galinhas de forma eficiente</p>

          {/* Status da conexão */}
          <div className="mt-4">
            {/* Atualizar o componente StatusConexao para incluir connectionStatus e onReconnect */}
            <StatusConexao
              usingMockData={usingMockData}
              connectionStatus={connectionStatus}
              error={error}
              onReconnect={tentarReconectar}
            />
          </div>

          {/* Adicionar o DebugPanel logo após o StatusConexao */}
          <div className="mt-4">
            <DebugPanel
              usingMockData={usingMockData}
              connectionStatus={connectionStatus}
              error={error}
              galinhasCount={galinhas.length}
              transacoesCount={transacoes.length}
              onReconnect={tentarReconectar}
            />
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Galinhas</CardTitle>
              <Egg className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGalinhas}</div>
              <p className="text-xs text-muted-foreground">{galinhasAtivas} ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produção Semanal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{producaoSemanalTotal}</div>
              <p className="text-xs text-muted-foreground">ovos por semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ganhos</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {totalGanhos.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
              <DollarSign className={`h-4 w-4 ${lucroTotal >= 0 ? "text-green-600" : "text-red-600"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${lucroTotal >= 0 ? "text-green-600" : "text-red-600"}`}>
                R$ {lucroTotal.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Ganhos - Gastos</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="galinhas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="galinhas">Galinhas</TabsTrigger>
            <TabsTrigger value="codigos">Códigos</TabsTrigger>
            <TabsTrigger value="gastos">Gastos</TabsTrigger>
            <TabsTrigger value="ganhos">Ganhos</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          {/* Aba Galinhas */}
          <TabsContent value="galinhas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Nova Galinha</CardTitle>
                <CardDescription>Registre uma nova galinha no sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={novaGalinha.nome}
                      onChange={(e) => setNovaGalinha({ ...novaGalinha, nome: e.target.value })}
                      placeholder="Ex: Galinha 1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="raca">Raça *</Label>
                    <Select
                      value={novaGalinha.raca}
                      onValueChange={(value) => setNovaGalinha({ ...novaGalinha, raca: value })}
                    >
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
                  <div>
                    <Label htmlFor="idade">Idade (meses) *</Label>
                    <Input
                      id="idade"
                      type="number"
                      value={novaGalinha.idade}
                      onChange={(e) => setNovaGalinha({ ...novaGalinha, idade: e.target.value })}
                      placeholder="Ex: 6"
                    />
                  </div>
                  <div>
                    <Label htmlFor="producao">Produção Semanal (ovos)</Label>
                    <Input
                      id="producao"
                      type="number"
                      value={novaGalinha.producaoSemanal}
                      onChange={(e) => setNovaGalinha({ ...novaGalinha, producaoSemanal: e.target.value })}
                      placeholder="Ex: 6"
                    />
                  </div>
                  <div>
                    <Label>Data de Aquisição</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(novaGalinha.dataAquisicao, "dd/MM/yyyy", { locale: ptBR })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={novaGalinha.dataAquisicao}
                          onSelect={(date) => date && setNovaGalinha({ ...novaGalinha, dataAquisicao: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button onClick={handleAdicionarGalinha} disabled={adicionandoGalinha} className="w-full md:w-auto">
                  {adicionandoGalinha ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {adicionandoGalinha ? "Adicionando..." : "Adicionar Galinha"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Buscar Galinha por Código de Barras</CardTitle>
                <CardDescription>Digite ou escaneie o código de barras para encontrar uma galinha</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite o código (ex: GAL001)"
                    value={buscaCodigoBarras}
                    onChange={(e) => setBuscaCodigoBarras(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleBuscarPorCodigo()}
                    className="flex-1"
                  />
                  <Button onClick={handleBuscarPorCodigo}>
                    <Scan className="mr-2 h-4 w-4" />
                    Buscar
                  </Button>
                </div>

                {galinhaEncontrada && (
                  <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-green-800">{galinhaEncontrada.nome}</h3>
                      <Badge variant="outline" className="bg-green-100">
                        {galinhaEncontrada.codigo_barras}
                      </Badge>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>
                        <strong>Raça:</strong> {galinhaEncontrada.raca}
                      </p>
                      <p>
                        <strong>Status:</strong> {galinhaEncontrada.status}
                      </p>
                      <p>
                        <strong>Produção:</strong> {galinhaEncontrada.producao_semanal} ovos/semana
                      </p>
                    </div>
                  </div>
                )}

                {buscaCodigoBarras && !galinhaEncontrada && buscaCodigoBarras.length >= 3 && (
                  <div className="p-4 border-2 border-red-200 bg-red-50 rounded-lg">
                    <p className="text-red-700">Nenhuma galinha encontrada com o código "{buscaCodigoBarras}"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Galinhas ({galinhas.length})</CardTitle>
                <CardDescription>Gerencie suas galinhas cadastradas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {galinhas.map((galinha) => (
                    <div key={galinha.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{galinha.nome}</h3>
                          <Badge variant="outline" className="font-mono">
                            {galinha.codigo_barras}
                          </Badge>
                          <Badge
                            variant={
                              galinha.status === "ativa"
                                ? "default"
                                : galinha.status === "doente"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {galinha.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Raça:</strong> {galinha.raca}
                          </p>
                          <p>
                            <strong>Idade:</strong> {galinha.idade} meses
                          </p>
                          <p>
                            <strong>Produção:</strong> {galinha.producao_semanal} ovos/semana
                          </p>
                          <p>
                            <strong>Adquirida em:</strong>{" "}
                            {format(new Date(galinha.data_aquisicao), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setGalinhaSelecionada(galinha)}>
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Select
                          value={galinha.status}
                          onValueChange={(value: "ativa" | "doente" | "vendida") =>
                            handleAtualizarStatus(galinha.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativa">Ativa</SelectItem>
                            <SelectItem value="doente">Doente</SelectItem>
                            <SelectItem value="vendida">Vendida</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoverGalinha(galinha.id, galinha.nome)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Códigos de Barras */}
          <TabsContent value="codigos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Códigos de Barras</CardTitle>
                <CardDescription>Visualize, imprima e gerencie códigos de barras das galinhas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="selecionar-galinha">Selecionar Galinha</Label>
                  <Select
                    value={galinhaSelecionada?.id || ""}
                    onValueChange={(value) => {
                      const galinha = galinhas.find((g) => g.id === value)
                      setGalinhaSelecionada(galinha || null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha uma galinha" />
                    </SelectTrigger>
                    <SelectContent>
                      {galinhas.map((galinha) => (
                        <SelectItem key={galinha.id} value={galinha.id}>
                          {galinha.nome} - {galinha.codigo_barras}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {galinhaSelecionada && (
                  <div className="flex justify-center">
                    <CodigoBarras codigo={galinhaSelecionada.codigo_barras} nome={galinhaSelecionada.nome} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Gastos */}
          <TabsContent value="gastos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Gasto</CardTitle>
                <CardDescription>Adicione um novo gasto ao sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoria-gasto">Categoria *</Label>
                    <Select
                      value={novaTransacao.tipo === "gasto" ? novaTransacao.categoria : ""}
                      onValueChange={(value) => setNovaTransacao({ ...novaTransacao, categoria: value, tipo: "gasto" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ração">Ração</SelectItem>
                        <SelectItem value="Medicamentos">Medicamentos</SelectItem>
                        <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                        <SelectItem value="Manutenção">Manutenção</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="valor-gasto">Valor (R$) *</Label>
                    <Input
                      id="valor-gasto"
                      type="number"
                      step="0.01"
                      value={novaTransacao.valor}
                      onChange={(e) => setNovaTransacao({ ...novaTransacao, valor: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="descricao-gasto">Descrição *</Label>
                    <Textarea
                      id="descricao-gasto"
                      value={novaTransacao.descricao}
                      onChange={(e) => setNovaTransacao({ ...novaTransacao, descricao: e.target.value })}
                      placeholder="Descreva o gasto..."
                    />
                  </div>
                  <div>
                    <Label>Data</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(novaTransacao.data, "dd/MM/yyyy", { locale: ptBR })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={novaTransacao.data}
                          onSelect={(date) => date && setNovaTransacao({ ...novaTransacao, data: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button onClick={handleAdicionarTransacao} disabled={adicionandoTransacao} className="w-full md:w-auto">
                  {adicionandoTransacao ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {adicionandoTransacao ? "Registrando..." : "Registrar Gasto"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Gastos</CardTitle>
                <CardDescription>Total de gastos: R$ {totalGastos.toFixed(2)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transacoes
                    .filter((t) => t.tipo === "gasto")
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                    .map((transacao) => (
                      <div key={transacao.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="destructive">{transacao.categoria}</Badge>
                            <span className="text-sm text-gray-500">
                              {format(new Date(transacao.data), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{transacao.descricao}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-red-600">-R$ {transacao.valor.toFixed(2)}</span>
                          <Button variant="destructive" size="sm" onClick={() => handleRemoverTransacao(transacao.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Ganhos */}
          <TabsContent value="ganhos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Ganho</CardTitle>
                <CardDescription>Adicione um novo ganho ao sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoria-ganho">Categoria *</Label>
                    <Select
                      value={novaTransacao.tipo === "ganho" ? novaTransacao.categoria : ""}
                      onValueChange={(value) => setNovaTransacao({ ...novaTransacao, categoria: value, tipo: "ganho" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ovos">Venda de Ovos</SelectItem>
                        <SelectItem value="Galinhas">Venda de Galinhas</SelectItem>
                        <SelectItem value="Pintinhos">Venda de Pintinhos</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="valor-ganho">Valor (R$) *</Label>
                    <Input
                      id="valor-ganho"
                      type="number"
                      step="0.01"
                      value={novaTransacao.valor}
                      onChange={(e) => setNovaTransacao({ ...novaTransacao, valor: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="descricao-ganho">Descrição *</Label>
                    <Textarea
                      id="descricao-ganho"
                      value={novaTransacao.descricao}
                      onChange={(e) => setNovaTransacao({ ...novaTransacao, descricao: e.target.value })}
                      placeholder="Descreva o ganho..."
                    />
                  </div>
                  <div>
                    <Label>Data</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(novaTransacao.data, "dd/MM/yyyy", { locale: ptBR })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={novaTransacao.data}
                          onSelect={(date) => date && setNovaTransacao({ ...novaTransacao, data: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button onClick={handleAdicionarTransacao} disabled={adicionandoTransacao} className="w-full md:w-auto">
                  {adicionandoTransacao ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {adicionandoTransacao ? "Registrando..." : "Registrar Ganho"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Ganhos</CardTitle>
                <CardDescription>Total de ganhos: R$ {totalGanhos.toFixed(2)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transacoes
                    .filter((t) => t.tipo === "ganho")
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                    .map((transacao) => (
                      <div key={transacao.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="default">{transacao.categoria}</Badge>
                            <span className="text-sm text-gray-500">
                              {format(new Date(transacao.data), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{transacao.descricao}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-600">+R$ {transacao.valor.toFixed(2)}</span>
                          <Button variant="destructive" size="sm" onClick={() => handleRemoverTransacao(transacao.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Relatórios */}
          <TabsContent value="relatorios" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Financeiro</CardTitle>
                  <CardDescription>Visão geral das finanças do negócio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Total de Ganhos</span>
                    <span className="font-bold text-green-600">R$ {totalGanhos.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="font-medium">Total de Gastos</span>
                    <span className="font-bold text-red-600">R$ {totalGastos.toFixed(2)}</span>
                  </div>
                  <div
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      lucroTotal >= 0 ? "bg-blue-50" : "bg-orange-50"
                    }`}
                  >
                    <span className="font-medium">Lucro/Prejuízo</span>
                    <span className={`font-bold ${lucroTotal >= 0 ? "text-blue-600" : "text-orange-600"}`}>
                      R$ {lucroTotal.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas das Galinhas</CardTitle>
                  <CardDescription>Informações sobre o plantel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Total de Galinhas</span>
                    <span className="font-bold">{totalGalinhas}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Galinhas Ativas</span>
                    <span className="font-bold text-green-600">{galinhasAtivas}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium">Galinhas Doentes</span>
                    <span className="font-bold text-yellow-600">
                      {galinhas.filter((g) => g.status === "doente").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Produção Semanal</span>
                    <span className="font-bold text-blue-600">{producaoSemanalTotal} ovos</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Gastos por Categoria</CardTitle>
                <CardDescription>Distribuição dos gastos por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Ração", "Medicamentos", "Equipamentos", "Manutenção", "Outros"].map((categoria) => {
                    const gastoCategoria = transacoes
                      .filter((t) => t.tipo === "gasto" && t.categoria === categoria)
                      .reduce((total, t) => total + t.valor, 0)

                    const percentual = totalGastos > 0 ? (gastoCategoria / totalGastos) * 100 : 0

                    return (
                      <div key={categoria} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{categoria}</span>
                          <span>
                            R$ {gastoCategoria.toFixed(2)} ({percentual.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentual}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
