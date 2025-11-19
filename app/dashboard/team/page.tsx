"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Briefcase, Clock, TrendingUp, FileText, Award, Calendar, ArrowUp, ArrowDown, BarChart3, Download, Sparkles, ExternalLink } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { canAccessFeature } from "@/lib/user-roles"
import { useRouter } from 'next/router'

export default function TeamDashboardPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState("30days")
  const router = useRouter()
  
  // Mock data - Replace with actual API calls
  const teamMetrics = {
    totalEmployees: 43,
    employeeChange: 2.8,
    jobApplicants: 130,
    applicantChange: 13.9,
    totalSalary: 98842.0,
    salaryChange: 24,
    attendanceRate: 56,
    attendanceChange: -17,
    workedHours: 1248,
    completionRate: 87,
  }

  const teamDistribution = [
    { role: "Técnicos de Manutenção", count: 8, color: "bg-blue-500" },
    { role: "Engenheiros", count: 6, color: "bg-orange-500" },
    { role: "Operadores", count: 10, color: "bg-purple-500" },
    { role: "Analistas", count: 5, color: "bg-green-500" },
    { role: "Supervisores", count: 4, color: "bg-yellow-500" },
  ]

  const attendanceHeatmap = Array.from({ length: 12 }, (_, month) =>
    Array.from({ length: 4 }, (_, week) => ({
      month,
      week,
      value: Math.floor(Math.random() * 100),
    })),
  ).flat()

  const tasks = [
    {
      id: "1",
      title: "Finalizar Documentos de Onboarding",
      description: "Review and complete the digital onboarding documents for Emma Clarkson (Marketing Department).",
      tags: ["Documents", "Marketings", "Emma Clarkson"],
      status: "new",
      color: "blue",
    },
    {
      id: "2",
      title: "Publicar Vaga: Designer UI/UX",
      description: "Prepare and publish a compelling job listing for the UI/UX Designer role under the Product Design team.",
      tags: ["Job Opening", "Designer", "Published"],
      status: "in_progress",
      color: "orange",
    },
    {
      id: "3",
      title: "Aprovar Pedido de Férias Anual",
      description: "Daniel has submitted a leave request from April 20 to April 25 (5 business days) for personal reasons.",
      tags: ["Annual", "Report", "Daniel Rodriguez"],
      status: "completed",
      color: "green",
    },
  ]

  const isAdmin = user?.role === 'master' || user?.role === 'admin'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard de Equipe
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin
              ? "Visão completa de todas as equipes e métricas da empresa"
              : `Métricas e desempenho da sua equipe`}
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Period Filter */}
      <div className="flex items-center gap-2">
        {["30days", "3months", "6months"].map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
          >
            {period === "30days" ? "30 Dias" : period === "3months" ? "3 Meses" : "6 Meses"}
          </Button>
        ))}
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teamMetrics.totalEmployees}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <ArrowUp className="h-3 w-3 mr-1" />
                {teamMetrics.employeeChange}%
              </Badge>
              <span className="text-xs text-muted-foreground">+8 form last month</span>
            </div>
            <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-blue-600">
              Details →
            </Button>
          </CardContent>
        </Card>

        {/* Job Applicants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Job Applicant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teamMetrics.jobApplicants}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <ArrowUp className="h-3 w-3 mr-1" />
                {teamMetrics.applicantChange}%
              </Badge>
              <span className="text-xs text-muted-foreground">+48 form last month</span>
            </div>
            <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-blue-600">
              Details →
            </Button>
          </CardContent>
        </Card>

        {/* Total Salary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Total Salary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${teamMetrics.totalSalary.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <ArrowUp className="h-3 w-3 mr-1" />
                {teamMetrics.salaryChange}%
              </Badge>
              <span className="text-xs text-muted-foreground">+$4,214.00 from last month</span>
            </div>
            <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-blue-600">
              Details →
            </Button>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teamMetrics.attendanceRate}%</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                <ArrowDown className="h-3 w-3 mr-1" />
                {Math.abs(teamMetrics.attendanceChange)}%
              </Badge>
              <span className="text-xs text-muted-foreground">-16.4% form last month</span>
            </div>
            <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-blue-600">
              Details →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section: Team Distribution & Attendance Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Membros da Equipe</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/employees')}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Ver Todos
              </Button>
            </div>
            <CardDescription>Distribuição por função</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamDistribution.map((team) => (
              <div key={team.role} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{team.role}</span>
                  <span className="font-medium">{team.count} Pessoas</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${team.color}`}
                    style={{ width: `${(team.count / teamMetrics.totalEmployees) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Attendance Heatmap */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Attendance Report</CardTitle>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="font-bold text-2xl">{teamMetrics.totalEmployees}</span>
                  <span className="text-muted-foreground ml-2">Total Employee</span>
                </div>
                <div>
                  <span className="font-bold text-2xl">22</span>
                  <span className="text-muted-foreground ml-2">On Time</span>
                </div>
                <div>
                  <span className="font-bold text-2xl">19</span>
                  <span className="text-muted-foreground ml-2">Absent</span>
                </div>
                <div>
                  <span className="font-bold text-2xl">05</span>
                  <span className="text-muted-foreground ml-2">Late</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-1">
              {attendanceHeatmap.map((cell, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm"
                  style={{
                    backgroundColor:
                      cell.value > 75
                        ? "rgb(99, 102, 241)"
                        : cell.value > 50
                          ? "rgb(139, 92, 246)"
                          : cell.value > 25
                            ? "rgb(168, 85, 247)"
                            : "rgb(192, 132, 252)",
                    opacity: cell.value / 100,
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>Mei</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Insights de IA</CardTitle>
              <CardDescription>Análise preditiva da performance da equipe</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border">
            <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Performance em Alta</p>
              <p className="text-sm text-muted-foreground mt-1">
                A equipe de técnicos aumentou a produtividade em 18% no último mês, com 95% das manutenções preventivas
                concluídas no prazo.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border">
            <Award className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium">Sugestão de Reconhecimento</p>
              <p className="text-sm text-muted-foreground mt-1">
                Carlos Oliveira completou 15 análises de máquinas esta semana, 40% acima da média. Considere um
                reconhecimento formal.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border">
            <FileText className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <p className="font-medium">Atenção Necessária</p>
              <p className="text-sm text-muted-foreground mt-1">
                Taxa de presença abaixo do esperado na última semana. Recomenda-se revisar cronogramas e identificar
                possíveis causas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Task</CardTitle>
            <div className="flex items-center gap-2">
              <Tabs defaultValue="kanban" className="w-auto">
                <TabsList>
                  <TabsTrigger value="kanban">Kanban</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* New Request */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="font-medium">New Request</span>
                  <Badge variant="secondary">3</Badge>
                </div>
              </div>
              {tasks
                .filter((t) => t.status === "new")
                .map((task) => (
                  <Card key={task.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex gap-2">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                    </CardContent>
                  </Card>
                ))}
              <Button variant="ghost" className="w-full border-2 border-dashed">
                + Add
              </Button>
            </div>

            {/* In Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="font-medium">In Progress</span>
                  <Badge variant="secondary">6</Badge>
                </div>
              </div>
              {tasks
                .filter((t) => t.status === "in_progress")
                .map((task) => (
                  <Card key={task.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex gap-2">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                    </CardContent>
                  </Card>
                ))}
              <Button variant="ghost" className="w-full border-2 border-dashed">
                + Add
              </Button>
            </div>

            {/* Completed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium">Completed</span>
                  <Badge variant="secondary">3</Badge>
                </div>
              </div>
              {tasks
                .filter((t) => t.status === "completed")
                .map((task) => (
                  <Card key={task.id} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex gap-2">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                    </CardContent>
                  </Card>
                ))}
              <Button variant="ghost" className="w-full border-2 border-dashed">
                + Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
