"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Hook para buscar máquinas
export function useMachines(locationId?: string) {
  const url = locationId ? `/api/mock/machines?locationId=${locationId}` : "/api/mock/machines"

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    machines: data?.machines || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook para buscar uma máquina específica
export function useMachine(machineId: string) {
  const { data, error, isLoading } = useSWR(machineId ? `/api/mock/machines?id=${machineId}` : null, fetcher)

  return {
    machine: data?.machine || null,
    isLoading,
    isError: error,
  }
}

// Hook para buscar localizações/facilities
export function useLocations() {
  const { data, error, isLoading, mutate } = useSWR("/api/mock/locations", fetcher)

  return {
    locations: data?.locations || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook para buscar uma localização específica
export function useLocation(locationId: string) {
  const { data, error, isLoading } = useSWR(locationId ? `/api/mock/locations?id=${locationId}` : null, fetcher)

  return {
    location: data?.location || null,
    isLoading,
    isError: error,
  }
}

// Hook para buscar funcionários
export function useEmployees(departmentId?: string) {
  const url = departmentId ? `/api/mock/employees?departmentId=${departmentId}` : "/api/mock/employees"

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    employees: data?.employees || [],
    departments: data?.departments || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook para buscar tarefas
export function useTasks(status?: string) {
  const url = status ? `/api/mock/tasks?status=${status}` : "/api/mock/tasks"

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    tasks: data?.tasks || [],
    columns: data?.columns || [],
    automatedTasks: data?.automatedTasks || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook para buscar relatórios
export function useReports(type?: "machine" | "metrics") {
  const url = type ? `/api/mock/reports?type=${type}` : "/api/mock/reports"

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    machineReports: data?.machineReports || [],
    metricsReports: data?.metricsReports || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook para buscar dados da equipe
export function useTeam() {
  const { data, error, isLoading, mutate } = useSWR("/api/mock/team", fetcher)

  return {
    teamMembers: data?.teamMembers || [],
    metrics: data?.metrics || null,
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook para buscar fornecedores
export function useVendors(partId?: string) {
  const url = partId ? `/api/mock/vendors?partId=${partId}` : "/api/mock/vendors"

  const { data, error, isLoading } = useSWR(url, fetcher)

  return {
    vendors: data?.vendors || [],
    isLoading,
    isError: error,
  }
}

// Hook para buscar dados de renderização 3D do Bedrock
export function useBedrockRenderData(facilityType?: string, analysisType?: string) {
  let url = "/api/mock/bedrock"
  const params = new URLSearchParams()

  if (facilityType) params.append("facilityType", facilityType)
  if (analysisType) params.append("analysisType", analysisType)

  if (params.toString()) {
    url += `?${params.toString()}`
  }

  const { data, error, isLoading } = useSWR(url, fetcher)

  return {
    renderConfig: data?.renderConfig || null,
    facilityTypes: data?.facilityTypes || [],
    analysisPrompts: data?.analysisPrompts || [],
    isLoading,
    isError: error,
  }
}

// Hook para buscar inventário
export function useInventory() {
  const { data, error, isLoading, mutate } = useSWR("/api/mock/inventory", fetcher)

  return {
    parts: data?.parts || [],
    categories: data?.categories || [],
    lowStockAlerts: data?.lowStockAlerts || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook genérico para buscar qualquer endpoint
export function useMockApi<T>(endpoint: string) {
  const { data, error, isLoading, mutate } = useSWR<T>(`/api/mock${endpoint}`, fetcher)

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  }
}
