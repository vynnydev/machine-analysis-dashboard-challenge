"use client"

import { useState } from "react"
import { KanbanBoard } from "@/components/kanban-board"
import { Machine3DCard } from "@/components/machine-3d-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CalendarDays, Plus, Filter, Download, Users, FolderKanban, Clock, TrendingUp, LayoutGrid, List, Search, ChevronDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [periodFilter, setPeriodFilter] = useState("30days")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [stageFilter, setStageFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [openMetricDetail, setOpenMetricDetail] = useState<string | null>(null)

  const metrics = {
    teamMembers: {
      total: 24,
      change: "+2",
      previousPeriod: 22,
      distribution: [
        { role: "Técnicos de Manutenção", count: 8, color: "bg-blue-500" },
        { role: "Engenheiros", count: 6, color: "bg-orange-500" },
        { role: "Operadores", count: 10, color: "bg-purple-500" },
      ]
    },
    activeProjects: {
      total: 12,
      change: "+10.4%",
      previousPeriod: 9,
      trend: [65, 72, 68, 78, 85, 82, 90] // Weekly trend
    },
    hoursWorked: {
      total: 1248,
      change: "+15%",
      previousPeriod: 1085,
      avgPerMember: 52
    },
    completionRate: {
      total: 87,
      change: "+3%",
      previousPeriod: 84,
      onTime: 75,
      delayed: 12
    }
  }

  const stats = [
    {
      label: "Total de Tarefas",
      value: 16,
      color: "blue",
    },
    {
      label: "Em Progresso",
      value: 5,
      color: "orange",
    },
    {
      label: "Concluídas Hoje",
      value: 8,
      color: "green",
    },
    {
      label: "Atrasadas",
      value: 2,
      color: "red",
    },
  ]

  const activeMachines = [
    {
      id: "M001",
      name: "Robô Industrial CNC-X500",
      status: "running" as const,
      task: "Corte de peças de precisão - Padrão ST/I-3",
      speed: 85,
      efficiency: 92,
      temperature: 45,
      location: "Linha de Produção 1",
    },
    {
      id: "M002",
      name: "Torno Automático TA-2000",
      status: "running" as const,
      task: "Usinagem de eixos metálicos",
      speed: 78,
      efficiency: 88,
      temperature: 52,
      location: "Linha de Produção 2",
    },
    {
      id: "M003",
      name: "Fresadora CNC F-800",
      status: "idle" as const,
      task: "Aguardando próximo lote",
      speed: 0,
      efficiency: 0,
      temperature: 28,
      location: "Linha de Produção 3",
    },
  ]

  const tasks = [
    { id: "MT-001", title: "Inspeção de bomba centrífuga", priority: "high", status: "backlog", list: "Manutenção", tags: ["urgente", "preventiva"], dueDate: "19/11/2025", assignees: ["João Silva"] },
    { id: "MT-002", title: "Calibração de sensores", priority: "normal", status: "backlog", list: "Automação", tags: ["rotina"], dueDate: "21/11/2025", assignees: ["Carlos Oliveira"] },
    { id: "MT-003", title: "Troca de óleo do compressor", priority: "high", status: "in-progress", list: "Manutenção", tags: ["urgente"], dueDate: "18/11/2025", assignees: ["Ana Costa"] },
    { id: "MT-004", title: "Implementar automação de lubrificação", priority: "normal", status: "in-progress", list: "Automação", tags: ["upgrade"], dueDate: "24/11/2025", assignees: ["Fernanda Lima"] },
    { id: "MT-005", title: "Revisão de motor elétrico", priority: "high", status: "review", list: "Inspeção", tags: ["qualidade"], dueDate: "17/11/2025", assignees: ["Juliana Rocha"] },
    { id: "MT-006", title: "Teste de válvula de segurança", priority: "normal", status: "review", list: "Teste", tags: ["segurança"], dueDate: "20/11/2025", assignees: ["Patrícia Souza"] },
    { id: "MT-007", title: "Atualização de firmware CNC", priority: "low", status: "done", list: "Automação", tags: ["atualização"], dueDate: "16/11/2025", assignees: ["Ricardo Gomes"] },
  ]

  const filteredTasks = tasks.filter(task => {
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false
    if (stageFilter !== "all" && task.status !== stageFilter) return false
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400"
      case "normal": return "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400"
      case "low": return "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "backlog": return "bg-gray-100 dark:bg-gray-800"
      case "in-progress": return "bg-green-50 dark:bg-green-950"
      case "review": return "bg-purple-50 dark:bg-purple-950"
      case "done": return "bg-blue-50 dark:bg-blue-950"
      default: return "bg-gray-100"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "backlog": return "A Fazer"
      case "in-progress": return "Em Progresso"
      case "review": return "Em Revisão"
      case "done": return "Concluído"
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quadro de Tarefas</h1>
          <p className="text-muted-foreground mt-1">Gerencie tarefas de automação e manutenção de equipamentos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-full bg-${stat.color}-500/10 flex items-center justify-center`}>
                  <div className={`h-6 w-6 rounded-full bg-${stat.color}-500`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Máquinas em Operação</h2>
          <Badge variant="secondary">{activeMachines.filter((m) => m.status === "running").length} ativas</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeMachines.map((machine) => (
            <Machine3DCard key={machine.id} machine={machine} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={periodFilter} onValueChange={setPeriodFilter}>
          <TabsList>
            <TabsTrigger value="30days">30 Dias</TabsTrigger>
            <TabsTrigger value="3months">3 Meses</TabsTrigger>
            <TabsTrigger value="6months">6 Meses</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Simplified Team Members Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                Membros da Equipe
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setOpenMetricDetail("team")}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{metrics.teamMembers.total}</span>
              <span className="text-sm text-muted-foreground mb-1">Membros</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 mt-3">
              {metrics.teamMembers.change} desde último mês
            </Badge>
          </CardContent>
        </Card>

        {/* Simplified Active Projects Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-muted-foreground" />
                Projetos Ativos
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setOpenMetricDetail("projects")}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{metrics.activeProjects.total}</span>
              <span className="text-sm text-muted-foreground mb-1">Projetos</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 mt-3">
              {metrics.activeProjects.change} 9 projetos no último mês
            </Badge>
          </CardContent>
        </Card>

        {/* Simplified Hours Worked Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Horas Trabalhadas
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setOpenMetricDetail("hours")}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{metrics.hoursWorked.total}</span>
              <span className="text-sm text-muted-foreground mb-1">Horas</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 mt-3">
              {metrics.hoursWorked.change} vs período anterior
            </Badge>
          </CardContent>
        </Card>

        {/* Simplified Completion Rate Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                Taxa de Conclusão
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setOpenMetricDetail("completion")}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{metrics.completionRate.total}%</span>
              <span className="text-sm text-muted-foreground mb-1">Concluídas</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 mt-3">
              {metrics.completionRate.change} vs período anterior
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Dialog open={openMetricDetail === "team"} onOpenChange={() => setOpenMetricDetail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Detalhes da Equipe
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{metrics.teamMembers.total}</span>
              <span className="text-lg text-muted-foreground mb-2">Membros</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
              {metrics.teamMembers.change} desde último mês
            </Badge>
            
            <div className="space-y-3 mt-6">
              <h3 className="font-semibold">Distribuição por Função</h3>
              {metrics.teamMembers.distribution.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.role}</span>
                    <span className="font-medium">{item.count} Pessoas</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color}`} 
                      style={{ width: `${(item.count / metrics.teamMembers.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openMetricDetail === "projects"} onOpenChange={() => setOpenMetricDetail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Detalhes dos Projetos
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{metrics.activeProjects.total}</span>
              <span className="text-lg text-muted-foreground mb-2">Projetos</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
              {metrics.activeProjects.change} 9 projetos no último mês
            </Badge>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Tendência Semanal</h3>
              <div className="h-32 flex items-end gap-2">
                {metrics.activeProjects.trend.map((value, idx) => (
                  <div key={idx} className="flex-1 bg-blue-500/20 dark:bg-blue-500/30 rounded-t relative group">
                    <div 
                      className="absolute bottom-0 w-full bg-blue-500 rounded-t transition-all"
                      style={{ height: `${value}%` }}
                    />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                      {["Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set"][idx]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openMetricDetail === "hours"} onOpenChange={() => setOpenMetricDetail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Detalhes das Horas Trabalhadas
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{metrics.hoursWorked.total}</span>
              <span className="text-lg text-muted-foreground mb-2">Horas</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
              {metrics.hoursWorked.change} vs período anterior
            </Badge>
            
            <div className="mt-6 space-y-4">
              <div className="flex justify-between p-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Média por membro</span>
                <span className="font-bold text-lg">{metrics.hoursWorked.avgPerMember}h</span>
              </div>
              <div className="flex justify-between p-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Período anterior</span>
                <span className="font-bold text-lg">{metrics.hoursWorked.previousPeriod}h</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso do período</span>
                  <span className="font-medium">75%</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: "75%" }} />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openMetricDetail === "completion"} onOpenChange={() => setOpenMetricDetail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Detalhes da Taxa de Conclusão
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{metrics.completionRate.total}%</span>
              <span className="text-lg text-muted-foreground mb-2">Concluídas</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
              {metrics.completionRate.change} vs período anterior
            </Badge>
            
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarefas no prazo</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{metrics.completionRate.onTime} tarefas</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${(metrics.completionRate.onTime / (metrics.completionRate.onTime + metrics.completionRate.delayed)) * 100}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarefas atrasadas</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{metrics.completionRate.delayed} tarefas</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${(metrics.completionRate.delayed / (metrics.completionRate.onTime + metrics.completionRate.delayed)) * 100}%` }} />
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg mt-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Desempenho excelente!</strong> A equipe está mantendo {metrics.completionRate.total}% das tarefas concluídas, com {metrics.completionRate.onTime} entregas no prazo.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Tarefas de Manutenção</h2>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("kanban")}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Kanban
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Nível de prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas prioridades</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos estágios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos estágios</SelectItem>
              <SelectItem value="backlog">A Fazer</SelectItem>
              <SelectItem value="in-progress">Em Progresso</SelectItem>
              <SelectItem value="review">Em Revisão</SelectItem>
              <SelectItem value="done">Concluído</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Mais filtros
          </Button>

          <div className="relative flex-1 max-w-sm ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar tarefas..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {viewMode === "kanban" ? (
          <KanbanBoard />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-4 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Nome</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Prioridade</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Lista</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Tags</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Data de Entrega</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Group by status */}
                  {["backlog", "in-progress", "review", "done"].map((status) => {
                    const statusTasks = filteredTasks.filter(t => t.status === status)
                    if (statusTasks.length === 0) return null
                    
                    return (
                      <React.Fragment key={status}>
                        <tr className={`${getStatusColor(status)}`}>
                          <td colSpan={7} className="p-3">
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${
                                status === "backlog" ? "bg-gray-500" :
                                status === "in-progress" ? "bg-green-500" :
                                status === "review" ? "bg-purple-500" :
                                "bg-blue-500"
                              }`} />
                              <span className="font-medium text-sm">{getStatusLabel(status)}</span>
                              <Badge variant="secondary" className="ml-2">{statusTasks.length}</Badge>
                            </div>
                          </td>
                        </tr>
                        {statusTasks.map((task) => (
                          <tr key={task.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="p-4 text-sm text-muted-foreground font-mono">{task.id}</td>
                            <td className="p-4 text-sm font-medium">{task.title}</td>
                            <td className="p-4">
                              <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                                {task.priority === "high" ? "Alta" : task.priority === "normal" ? "Normal" : "Baixa"}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm">{task.list}</td>
                            <td className="p-4">
                              <div className="flex gap-1 flex-wrap">
                                {task.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">{task.dueDate}</td>
                            <td className="p-4">
                              <div className="flex -space-x-2">
                                {task.assignees.map((assignee, idx) => (
                                  <div 
                                    key={idx}
                                    className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-background"
                                    title={assignee}
                                  >
                                    {assignee.split(' ').map(n => n[0]).join('')}
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
              
              {filteredTasks.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                  <p>Nenhuma tarefa encontrada com os filtros atuais</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
