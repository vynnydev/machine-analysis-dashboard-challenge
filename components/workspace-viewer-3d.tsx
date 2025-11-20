"use client"

import type React from "react"
import { useRef, useEffect } from "react"

interface WorkspaceViewer3DProps {
  facility: any
  machines: any[]
  selectedZone: string
  onMachineClick: (machine: any) => void
}

export function WorkspaceViewer3D({ facility, machines, selectedZone, onMachineClick }: WorkspaceViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw isometric grid (corridors)
    const corridorCount = facility?.corridors || 3
    const corridorWidth = 150
    const corridorHeight = 80
    const startX = width / 2 - (corridorCount * corridorWidth) / 2
    const startY = height / 2 - 100

    // Draw corridors
    for (let i = 0; i < corridorCount; i++) {
      const x = startX + i * corridorWidth
      const y = startY + i * 20

      // Corridor surface (isometric)
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() || "#374151"
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + corridorWidth, y)
      ctx.lineTo(x + corridorWidth, y + corridorHeight)
      ctx.lineTo(x, y + corridorHeight)
      ctx.closePath()
      ctx.fill()

      // Corridor borders
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--border").trim() || "#1f2937"
      ctx.lineWidth = 2
      ctx.stroke()

      // Corridor label
      ctx.fillStyle =
        getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim() || "#9ca3af"
      ctx.font = "12px sans-serif"
      ctx.fillText(`Corredor ${i + 1}`, x + 10, y + 20)
    }

    // Draw machines
    machines.forEach((machine) => {
      const corridorIndex = machine.corridor - 1
      const machineX = startX + corridorIndex * corridorWidth + machine.position.x * 30
      const machineY = startY + corridorIndex * 20 + machine.position.y * 30

      // Machine representation (simple circle)
      const radius = 15

      // Status color
      let color = "#10b981" // green for operating
      if (machine.status === "maintenance") color = "#f59e0b" // amber
      if (machine.status === "waiting") color = "#ef4444" // red

      // Draw machine
      ctx.beginPath()
      ctx.arc(machineX, machineY, radius, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw machine icon (simplified)
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("M", machineX, machineY)
    })
  }, [facility, machines, selectedZone])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const corridorCount = facility?.corridors || 3
    const corridorWidth = 150
    const startX = width / 2 - (corridorCount * corridorWidth) / 2
    const startY = height / 2 - 100

    // Check if clicked on a machine
    machines.forEach((machine) => {
      const corridorIndex = machine.corridor - 1
      const machineX = startX + corridorIndex * corridorWidth + machine.position.x * 30
      const machineY = startY + corridorIndex * 20 + machine.position.y * 30

      const distance = Math.sqrt((x - machineX) ** 2 + (y - machineY) ** 2)
      if (distance < 15) {
        onMachineClick(machine)
      }
    })
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="w-full h-full cursor-pointer"
      style={{ background: "var(--background)" }}
    />
  )
}
