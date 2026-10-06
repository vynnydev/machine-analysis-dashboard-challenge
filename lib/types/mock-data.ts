// Tipos para os dados mockados da API

export interface MockMachine {
  id: string
  name: string
  model: string
  type: string
  status: "operational" | "warning" | "critical" | "maintenance"
  location: string
  locationId: string
  lastMaintenance: string
  nextMaintenance: string
  efficiency: number
  metrics: {
    temperature: number
    temperatureStatus: "normal" | "warning" | "critical"
    vibration: number
    vibrationStatus: "normal" | "warning" | "critical"
    pressure: number
    pressureStatus: "normal" | "warning" | "critical"
    runtime: number
    runtimeHours: number
  }
  parts: MockPart[]
}

export interface MockPart {
  id: string
  label: string
  name: string
  partNumber: string
  manufacturer: string
  status: "good" | "warning" | "critical"
  statusText: string
  recommendation: string
  position: { x: number; y: number }
  color: string
  lastMaintenance?: string
  lastReplacement?: string
  metrics?: {
    temperature?: number
    temperatureStatus?: "normal" | "warning" | "critical"
    vibration?: number
    vibrationStatus?: "normal" | "warning" | "critical"
    pressure?: number
    pressureStatus?: "normal" | "warning" | "critical"
    wear?: number
    wearStatus?: "normal" | "warning" | "critical"
  }
}

export interface MockLocation {
  id: string
  name: string
  type: "workshop" | "factory" | "warehouse" | "hospital" | "garage"
  address: string
  coordinates: { lat: number; lng: number }
  machineCount: number
  status: "active" | "maintenance" | "inactive"
  wings: MockWing[]
}

export interface MockWing {
  id: string
  name: string
  machineIds: string[]
  status: "active" | "maintenance" | "inactive"
}

export interface MockEmployee {
  id: string
  name: string
  email: string
  role: string
  department: string
  departmentId: string
  avatar: string
  status: "active" | "vacation" | "sick" | "training"
  skills: string[]
  certifications: string[]
  hireDate: string
  phone: string
}

export interface MockDepartment {
  id: string
  name: string
  managerId: string
  employeeCount: number
  color: string
}

export interface MockTask {
  id: string
  title: string
  description: string
  status: "backlog" | "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  assigneeId: string
  assigneeName: string
  assigneeAvatar: string
  machineId?: string
  machineName?: string
  dueDate: string
  createdAt: string
  tags: string[]
  estimatedHours: number
  completedHours?: number
}

export interface MockAutomatedTask {
  id: string
  title: string
  machineId: string
  machineName: string
  scheduledTime: string
  duration: number
  status: "scheduled" | "running" | "completed" | "failed"
  type: "maintenance" | "inspection" | "calibration" | "cleaning"
  createdBy: string
  createdAt: string
}

export interface MockReport {
  id: string
  machineId: string
  machineName: string
  type: "analysis" | "maintenance" | "performance"
  date: string
  time: string
  healthScore: number
  status: "excellent" | "good" | "warning" | "critical"
  metrics: {
    efficiency: number
    uptime: number
    temperature: number
    vibration: number
  }
  aiAnalysis: string[]
  recommendations: string[]
}

export interface MockMetricsReport {
  id: string
  title: string
  type: "tasks" | "team" | "inventory" | "performance"
  date: string
  time: string
  period: string
  summary: string
  metrics: Record<string, number | string>
}

export interface MockTeamMember {
  id: string
  name: string
  role: string
  avatar: string
  status: "online" | "offline" | "busy"
  tasksCompleted: number
  tasksInProgress: number
  efficiency: number
  skills: string[]
}

export interface MockTeamMetrics {
  totalMembers: number
  activeNow: number
  tasksCompletedToday: number
  averageEfficiency: number
  weeklyProgress: number[]
}

export interface MockVendor {
  id: string
  name: string
  rating: number
  reviews: number
  distance: string
  time: string
  price: number
  originalPrice: number
  discount: number
  status: "open" | "closed"
  hasStock: boolean
  image: string
  coordinates: { lat: number; lng: number }
  isTop?: boolean
}

export interface MockInventoryPart {
  id: string
  name: string
  partNumber: string
  category: string
  quantity: number
  minQuantity: number
  price: number
  supplier: string
  lastRestocked: string
  location: string
}

export interface MockInventoryCategory {
  id: string
  name: string
  partCount: number
  icon: string
}

// Tipos para configuração de renderização 3D do Bedrock
export interface BedrockRenderConfig {
  facilityType: string
  sceneSettings: {
    ambientLight: { intensity: number; color: string }
    directionalLight: { intensity: number; position: number[]; color: string }
    fog: { color: string; near: number; far: number }
    background: string
  }
  cameraSettings: {
    position: number[]
    target: number[]
    fov: number
    near: number
    far: number
  }
  machineModels: BedrockMachineModel[]
  environmentObjects: BedrockEnvironmentObject[]
  animations: BedrockAnimation[]
}

export interface BedrockMachineModel {
  id: string
  type: string
  position: number[]
  rotation: number[]
  scale: number[]
  color: string
  emissive?: string
  metalness: number
  roughness: number
  status: "operational" | "warning" | "critical" | "maintenance"
  animations: string[]
}

export interface BedrockEnvironmentObject {
  id: string
  type: "floor" | "wall" | "rack" | "conveyor" | "crane" | "forklift" | "workbench" | "cabinet"
  position: number[]
  rotation: number[]
  scale: number[]
  color: string
  material: "concrete" | "metal" | "wood" | "plastic"
}

export interface BedrockAnimation {
  id: string
  targetId: string
  type: "rotation" | "translation" | "scale" | "color"
  keyframes: { time: number; value: number[] | string }[]
  loop: boolean
  duration: number
}

export interface BedrockFacilityType {
  id: string
  name: string
  description: string
  defaultMachineTypes: string[]
  environmentPreset: string
}

export interface BedrockAnalysisPrompt {
  id: string
  type: string
  prompt: string
  expectedOutputFormat: string
}
