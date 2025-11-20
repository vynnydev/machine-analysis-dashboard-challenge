"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw, ChevronUp, ChevronDown, X, Box, Layers } from "lucide-react"
import { SetupFacilityModal } from "@/components/setup-facility-modal"
import { AddMachineModal } from "@/components/add-machine-modal"
import { WorkspaceViewer3D } from "@/components/workspace-viewer-3d"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function WorkspacePage() {
  const [setupModalOpen, setSetupModalOpen] = useState(false)
  const [addMachineModalOpen, setAddMachineModalOpen] = useState(false)
  const [selectedZone, setSelectedZone] = useState("Zone T2")
  const [selectedMachine, setSelectedMachine] = useState<any>(null)
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(false)
  const [rightPanelExpanded, setRightPanelExpanded] = useState(false)
  const [renderMode, setRenderMode] = useState<"3d" | "svg">("3d")

  // Mock data - in production this would come from an API/database
  const [facility, setFacility] = useState<any>({
    name: "Oficina Centro Automotiva",
    type: "Oficina",
    address: "Rua das Indústrias, 123",
    zones: ["Zone T1", "Zone T2", "Zone T3"],
    corridors: 3,
  })

  const [machines, setMachines] = useState<any[]>([
    {
      id: "machine-1762603834049",
      name: "Bomba Centrífuga",
      type: "Bomba",
      status: "maintenance",
      corridor: 1,
      position: { x: 1, y: 1 },
      metrics: {
        efficiency: 86.8,
        performance: 94.3,
        quality: 98.3,
        availability: 92.0,
      },
    },
  ])

  const totalMachines = machines.length
  const operatingMachines = machines.filter((m) => m.status === "operating").length
  const maintenanceMachines = machines.filter((m) => m.status === "maintenance").length
  const waitingMachines = machines.filter((m) => m.status === "waiting").length

  const handleAddMachine = (machineData: any) => {
    const newMachine = {
      ...machineData,
      id: `machine-${Date.now()}`,
    }
    setMachines([...machines, newMachine])
  }

  const handleRemoveMachine = (machineId: string) => {
    setMachines(machines.filter((m) => m.id !== machineId))
    setSelectedMachine(null)
  }

  const handleSyncAPI = () => {
    console.log("[v0] Syncing with API...")
  }

  // Check if facility is set up
  const isFacilitySetup = facility && facility.name

  useEffect(() => {
    if (!isFacilitySetup) {
      setSetupModalOpen(true)
    }
  }, [isFacilitySetup])

  return (
    <div className="fixed inset-0 top-16 bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-b border-border z-20 flex items-center justify-between px-6 pl-24">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Monitor de Máquinas</h1>
            <p className="text-sm text-muted-foreground">{facility?.name || "Configure seu ambiente de trabalho"}</p>
          </div>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-4 py-2 bg-muted border border-border rounded-lg text-sm"
          >
            {facility?.zones?.map((zone: string) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={renderMode === "3d" ? "default" : "outline"}
            onClick={() => setRenderMode("3d")}
            className="gap-2"
            size="sm"
          >
            <Box className="h-4 w-4" />
            3D
          </Button>
          <Button
            variant={renderMode === "svg" ? "default" : "outline"}
            onClick={() => setRenderMode("svg")}
            className="gap-2"
            size="sm"
          >
            <Layers className="h-4 w-4" />
            SVG
          </Button>
          <Button variant="outline" onClick={handleSyncAPI} className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Sincronizar API
          </Button>
          <Button onClick={() => setAddMachineModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            Adicionar Máquina
          </Button>
          <Button variant="outline" onClick={() => setSetupModalOpen(true)}>
            Configurar Local
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute top-16 left-0 right-0 bottom-0 pl-72">
        <Card
          className={`absolute left-6 top-6 bg-card/95 backdrop-blur-sm border-border transition-all duration-300 z-10 ${
            leftPanelExpanded ? "w-80 h-auto" : "w-16 h-16"
          }`}
        >
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeftPanelExpanded(!leftPanelExpanded)}
              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 border border-border hover:bg-background"
            >
              {leftPanelExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {leftPanelExpanded ? (
              <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Total Equipment */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <span>Total de Equipamentos</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">{totalMachines}</span>
                    <span className="text-sm text-muted-foreground">Equipamentos</span>
                  </div>
                </div>

                {/* Operating */}
                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm text-foreground">Operando</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold text-foreground">{operatingMachines}</span>
                    <span className="text-xs text-muted-foreground">Equipamentos</span>
                  </div>
                </div>

                {/* In Maintenance */}
                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-sm text-foreground">Em Manutenção</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold text-foreground">{maintenanceMachines}</span>
                    <span className="text-xs text-muted-foreground">Equipamentos</span>
                  </div>
                </div>

                {/* Waiting Maintenance */}
                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-sm text-foreground">Aguardando Manutenção</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold text-foreground">{waitingMachines}</span>
                    <span className="text-xs text-muted-foreground">Equipamentos</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 flex items-center justify-center">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Center - 3D Viewer */}
        <div className="w-full h-full">
          <Suspense
            fallback={<div className="flex items-center justify-center h-full">Carregando visualização 3D...</div>}
          >
            <WorkspaceViewer3D
              facility={facility}
              machines={machines}
              selectedZone={selectedZone}
              onMachineClick={setSelectedMachine}
              renderMode={renderMode}
            />
          </Suspense>

          {/* Timeline */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-6 px-6 py-2 bg-background/80 backdrop-blur-sm rounded-full border border-border">
            {["10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45"].map((time, i) => (
              <div key={time} className="flex flex-col items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${i === 2 ? "bg-emerald-500" : "bg-muted"}`} />
                <span className="text-xs text-muted-foreground">{time}</span>
              </div>
            ))}
          </div>

          {/* Machine Detail Card (Bottom) */}
          {selectedMachine && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[700px]">
              <Card className="p-6 bg-background/95 backdrop-blur-sm border-border">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">{selectedMachine.id}</h3>
                      <Badge
                        variant={selectedMachine.status === "operating" ? "default" : "secondary"}
                        className={
                          selectedMachine.status === "maintenance"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : ""
                        }
                      >
                        {selectedMachine.status === "maintenance"
                          ? "Em Manutenção"
                          : selectedMachine.status === "operating"
                            ? "Em Operação"
                            : "Aguardando"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedMachine.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Corredor {selectedMachine.corridor} - Posição: ({selectedMachine.position.x},{" "}
                      {selectedMachine.position.y})
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Eficiência:</p>
                      <p className="text-lg font-semibold text-cyan-500">{selectedMachine.metrics.efficiency}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Desempenho:</p>
                      <p className="text-lg font-semibold text-cyan-500">{selectedMachine.metrics.performance}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Qualidade:</p>
                      <p className="text-lg font-semibold text-cyan-500">{selectedMachine.metrics.quality}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Disponibilidade:</p>
                      <p className="text-lg font-semibold text-cyan-500">{selectedMachine.metrics.availability}%</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    >
                      Em Manutenção
                    </Badge>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveMachine(selectedMachine.id)}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Remover Máquina
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        <Card
          className={`absolute right-6 top-6 bg-card/95 backdrop-blur-sm border-border transition-all duration-300 z-10 ${
            rightPanelExpanded ? "w-96 h-auto" : "w-16 h-16"
          }`}
        >
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRightPanelExpanded(!rightPanelExpanded)}
              className="absolute left-2 top-2 h-8 w-8 rounded-full bg-background/80 border border-border hover:bg-background"
            >
              {rightPanelExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {rightPanelExpanded ? (
              <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Metrics Chart */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-foreground">Métricas de Equipamentos</h3>
                    <span className="text-xs text-emerald-500">↗ 86.8%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Indicadores médios de desempenho</p>
                  <div className="space-y-3">
                    <div className="flex items-end justify-between h-32 gap-2">
                      <div className="flex-1 flex flex-col justify-end items-center gap-1">
                        <div className="w-full bg-cyan-500 rounded-t" style={{ height: "70%" }} />
                        <span className="text-[10px] text-muted-foreground">Efic.</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-end items-center gap-1">
                        <div className="w-full bg-cyan-500 rounded-t" style={{ height: "55%" }} />
                        <span className="text-[10px] text-muted-foreground">Desemp.</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-end items-center gap-1">
                        <div className="w-full bg-cyan-500 rounded-t" style={{ height: "85%" }} />
                        <span className="text-[10px] text-muted-foreground">Dispon.</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-muted-foreground">Efic.</span>
                      <span className="text-sm font-semibold">86.8%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-xs text-muted-foreground">Desemp.</span>
                      <span className="text-sm font-semibold">94.3%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-xs text-muted-foreground">Qualid.</span>
                      <span className="text-sm font-semibold">98.3%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-xs text-muted-foreground">Dispon.</span>
                      <span className="text-sm font-semibold">92.0%</span>
                    </div>
                  </div>
                </div>

                {/* Efficiency Over Time */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-sm font-medium text-foreground mb-2">Eficiência ao Longo do Tempo</h3>
                  <p className="text-xs text-muted-foreground mb-4">Últimas 6 horas de desempenho</p>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl font-bold text-emerald-500">90.8%</span>
                    <span className="text-xs text-emerald-500">↗ 0.5%</span>
                  </div>
                  <div className="h-20 flex items-end gap-1">
                    {[78, 82, 85, 88, 89, 90, 91, 92].map((value, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 flex items-center justify-center">
                <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-cyan-500" />
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <SetupFacilityModal
        open={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        onSave={(data) => {
          setFacility(data)
          setSetupModalOpen(false)
        }}
        existingData={facility}
      />

      <AddMachineModal
        open={addMachineModalOpen}
        onClose={() => setAddMachineModalOpen(false)}
        onSave={handleAddMachine}
        facility={facility}
      />
    </div>
  )
}
