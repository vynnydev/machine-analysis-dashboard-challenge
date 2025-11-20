"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import type * as THREE from "three"

function RoboticArm({
  color = "#f59e0b",
  position = [0, 0, 0],
  rotation = 0,
  status = "operating",
}: {
  color?: string
  position?: [number, number, number]
  rotation?: number
  status?: string
}) {
  const armRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (armRef.current && status === "operating") {
      const time = state.clock.getElapsedTime()
      armRef.current.rotation.y = rotation + Math.sin(time * 0.5) * 0.3
      armRef.current.children[3].rotation.z = 0.3 + Math.sin(time * 0.8) * 0.4
    }
  })

  const statusColor = status === "operating" ? "#10b981" : status === "maintenance" ? "#f59e0b" : "#ef4444"

  return (
    <group ref={armRef} position={position} scale={0.5}>
      {/* Base */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.5, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Lower arm */}
      <mesh position={[0, 1, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.25, 1.2, 0.25]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Joint sphere */}
      <mesh position={[0.35, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Upper arm */}
      <mesh position={[0.8, 1.9, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.2, 0.9, 0.2]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Gripper */}
      <mesh position={[1.15, 2.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.3, 0.15]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Status indicator light */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={2} />
        <pointLight intensity={0.5} distance={2} color={statusColor} />
      </mesh>
    </group>
  )
}

function FactoryFloor({ corridors = 3 }: { corridors: number }) {
  return (
    <group>
      {/* Factory floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[20, 0.1, 20]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.8} />
      </mesh>

      {/* Corridors */}
      {Array.from({ length: corridors }).map((_, i) => (
        <group key={i} position={[-6 + i * 4, 0, 0]}>
          <mesh position={[0, 0, 0]} receiveShadow>
            <boxGeometry args={[3.5, 0.15, 15]} />
            <meshStandardMaterial color="#334155" metalness={0.3} roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Grid helper */}
      <gridHelper args={[20, 20, "#475569", "#1e293b"]} />
    </group>
  )
}

interface WorkspaceViewer3DProps {
  facility: any
  machines: any[]
  selectedZone: string
  onMachineClick: (machine: any) => void
  renderMode: "3d" | "svg"
}

export function WorkspaceViewer3D({
  facility,
  machines,
  selectedZone,
  onMachineClick,
  renderMode,
}: WorkspaceViewer3DProps) {
  if (renderMode === "svg") {
    return <SVGWorkspaceViewer facility={facility} machines={machines} onMachineClick={onMachineClick} />
  }

  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={30}
        />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight position={[-10, 15, -10]} angle={0.3} penumbra={1} intensity={0.5} castShadow />
        <pointLight position={[0, 10, 0]} intensity={0.4} />

        <FactoryFloor corridors={facility?.corridors || 3} />

        {/* Render machines */}
        {machines.map((machine, idx) => {
          const x = -6 + (machine.corridor - 1) * 4 + (machine.position.x - 1) * 0.5
          const z = -5 + machine.position.y * 2
          return (
            <group key={machine.id} onClick={() => onMachineClick(machine)}>
              <RoboticArm
                position={[x, 0, z]}
                rotation={idx * 0.5}
                color={machine.status === "maintenance" ? "#f59e0b" : "#3b82f6"}
                status={machine.status}
              />
            </group>
          )
        })}

        <Environment preset="warehouse" />
      </Canvas>
    </div>
  )
}

function SVGWorkspaceViewer({
  facility,
  machines,
  onMachineClick,
}: { facility: any; machines: any[]; onMachineClick: (machine: any) => void }) {
  const corridorCount = facility?.corridors || 3
  const viewBoxWidth = 800
  const viewBoxHeight = 600
  const corridorWidth = 200
  const corridorHeight = 400
  const startX = (viewBoxWidth - corridorCount * corridorWidth) / 2
  const startY = 100

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="bg-background">
      <defs>
        {/* Gradient for corridors */}
        <linearGradient id="corridorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--muted)" />
          <stop offset="100%" stopColor="var(--border)" />
        </linearGradient>
      </defs>

      {/* Draw corridors */}
      {Array.from({ length: corridorCount }).map((_, i) => (
        <g key={i}>
          <rect
            x={startX + i * corridorWidth}
            y={startY}
            width={corridorWidth - 10}
            height={corridorHeight}
            fill="url(#corridorGradient)"
            stroke="var(--border)"
            strokeWidth="2"
            rx="8"
          />
          <text
            x={startX + i * corridorWidth + 20}
            y={startY + 30}
            fill="var(--muted-foreground)"
            fontSize="16"
            fontWeight="bold"
          >
            Corredor {i + 1}
          </text>
        </g>
      ))}

      {/* Draw machines with animation */}
      {machines.map((machine) => {
        const machineX = startX + (machine.corridor - 1) * corridorWidth + machine.position.x * 60
        const machineY = startY + machine.position.y * 80
        const statusColor =
          machine.status === "operating" ? "#10b981" : machine.status === "maintenance" ? "#f59e0b" : "#ef4444"

        return (
          <g key={machine.id} onClick={() => onMachineClick(machine)} style={{ cursor: "pointer" }}>
            {/* Machine body */}
            <rect
              x={machineX}
              y={machineY}
              width="40"
              height="50"
              fill={statusColor}
              stroke="#fff"
              strokeWidth="2"
              rx="4"
            >
              {machine.status === "operating" && (
                <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
              )}
            </rect>
            {/* Machine icon */}
            <text x={machineX + 20} y={machineY + 32} fill="#fff" fontSize="20" textAnchor="middle" fontWeight="bold">
              M
            </text>
            {/* Machine label */}
            <text x={machineX + 20} y={machineY + 70} fill="var(--foreground)" fontSize="10" textAnchor="middle">
              {machine.name.substring(0, 10)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
