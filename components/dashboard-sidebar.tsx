"use client"

import { useState } from "react"
import {
  CreditCard,
  Settings,
  Wrench,
  Truck,
  Workflow,
  FileText,
  Users,
  LayoutDashboard,
  ListChecks,
  Activity,
  Package,
  BarChart3,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  SpaceIcon as WorkspaceIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AccountSwitcher } from "@/components/account-switcher"

interface DashboardSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function DashboardSidebar({ sidebarOpen, setSidebarOpen }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const navigation = [
    {
      name: "Monitor de Máquinas",
      href: "/dashboard/workspace",
      icon: WorkspaceIcon,
    },
    {
      name: "Tarefas",
      href: "/dashboard/tasks",
      icon: ListChecks,
    },
    {
      name: "Análise de Máquinas",
      href: "/dashboard/analysis",
      icon: LayoutDashboard,
    },
    {
      name: "Relatórios",
      href: "/dashboard/reports",
      icon: FileText,
    },
    {
      name: "Equipe",
      href: "/dashboard/team",
      icon: Users,
    },
    {
      name: "Monitoramento",
      href: "/dashboard/monitoring",
      icon: Activity,
    },
    {
      name: "Oficina Virtual",
      href: "/dashboard/workshops",
      icon: Wrench,
    },
    {
      name: "Transporte & Reboque",
      href: "/dashboard/transport",
      icon: Truck,
    },
    {
      name: "Automatizar Fluxos",
      href: "/dashboard/workflows",
      icon: Workflow,
    },
    {
      name: "Inventário",
      href: "/dashboard/inventory",
      icon: Package,
    },
    {
      name: "Diagnósticos",
      href: "/dashboard/diagnostics",
      icon: BarChart3,
    },
    {
      name: "Faturamento",
      href: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      name: "Configurações",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const handleLogout = () => {
    console.log("[v0] Logout clicked (auth disabled for development)")
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 border-r border-blue-700 dark:border-blue-800 transform transition-all duration-300 lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-700 dark:border-blue-800 min-h-[73px]">
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <h1 className="text-xl font-bold text-white truncate">Cognitiva Analytics</h1>
              <p className="text-xs text-blue-200 mt-1">Análise Preditiva</p>
            </div>
          )}

          <div className="flex items-center gap-1">
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-blue-200 hover:text-white hover:bg-blue-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Collapse/Expand button (desktop only) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-blue-200 hover:text-white hover:bg-blue-700"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Expandir menu" : "Minimizar menu"}
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full text-blue-100 hover:text-white hover:bg-blue-700/50 dark:hover:bg-blue-800/50",
                    isActive && "bg-blue-600 text-white hover:bg-blue-500",
                    collapsed ? "justify-center px-2" : "justify-start",
                  )}
                  onClick={() => setSidebarOpen(false)}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700 dark:border-blue-800 space-y-3">
          {!collapsed ? (
            <>
              <AccountSwitcher />
              <Button
                variant="outline"
                className="w-full bg-red-500/10 border-red-400/20 hover:bg-red-500/20 text-red-300 hover:text-red-200"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="w-full bg-red-500/10 border-red-400/20 hover:bg-red-500/20 text-red-300 hover:text-red-200"
              onClick={handleLogout}
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
}
