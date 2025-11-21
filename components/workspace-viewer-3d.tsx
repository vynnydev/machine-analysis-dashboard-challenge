"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, Text } from "@react-three/drei"
import type * as THREE from "three"

function Forklift({ position = [0, 0, 0], rotation = 0, color = "#2563eb", moving = false }: any) {
  const forkRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (forkRef.current && moving) {
      const time = state.clock.getElapsedTime()
      forkRef.current.position.z = position[2] + Math.sin(time * 0.5) * 2
    }
  })

  return (
    <group ref={forkRef} position={position} rotation={[0, rotation, 0]} scale={0.4}>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 1.2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Mast */}
      <mesh position={[0, 1.2, -0.3]} castShadow>
        <boxGeometry args={[0.15, 1.8, 0.15]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Forks */}
      <mesh position={[-0.2, 0.3, -0.8]} castShadow>
        <boxGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.2, 0.3, -0.8]} castShadow>
        <boxGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Wheels */}
      {[
        [-0.3, 0.15, 0.4],
        [0.3, 0.15, 0.4],
        [-0.3, 0.15, -0.4],
        [0.3, 0.15, -0.4],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.15, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      ))}

      {/* Lights */}
      <pointLight position={[0, 0.8, -0.5]} intensity={0.3} distance={3} color="#fbbf24" />
    </group>
  )
}

function StorageRack({ position = [0, 0, 0], withPallets = true }: any) {
  return (
    <group position={position}>
      {/* Vertical supports */}
      {[
        [-1.5, 0, -0.5],
        [1.5, 0, -0.5],
        [-1.5, 0, 0.5],
        [1.5, 0, 0.5],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.15, 4, 0.15]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Horizontal beams - 4 levels */}
      {[0.5, 1.5, 2.5, 3.5].map((y, level) => (
        <group key={level}>
          <mesh position={[0, y, -0.5]} castShadow>
            <boxGeometry args={[3.3, 0.1, 0.1]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, y, 0.5]} castShadow>
            <boxGeometry args={[3.3, 0.1, 0.1]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Pallets with boxes */}
          {withPallets && level < 3 && (
            <group position={[0, y + 0.25, 0]}>
              {/* Pallet */}
              <mesh castShadow>
                <boxGeometry args={[1.2, 0.15, 1]} />
                <meshStandardMaterial color="#8b4513" roughness={0.9} />
              </mesh>
              {/* Boxes on pallet */}
              <mesh position={[0, 0.35, 0]} castShadow>
                <boxGeometry args={[1, 0.5, 0.8]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  )
}

function ConveyorBelt({ position = [0, 0, 0], length = 5, active = true }: any) {
  const beltRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (beltRef.current && active) {
      const material = beltRef.current.material as THREE.MeshStandardMaterial
      if (material.map) {
        material.map.offset.y -= 0.01
      }
    }
  })

  return (
    <group position={position}>
      {/* Belt surface */}
      <mesh ref={beltRef} position={[0, 0.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[1, 0.1, length]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Side supports */}
      <mesh position={[-0.6, 0.15, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, length]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.6, 0.15, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, length]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Movement indicators */}
      {active && (
        <>
          <pointLight position={[0, 0.5, 0]} intensity={0.2} distance={2} color="#10b981" />
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
          </mesh>
        </>
      )}
    </group>
  )
}

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

function FactoryFloor({ corridors = 3, facilityType = "workshop" }: { corridors: number; facilityType?: string }) {
  const floorSize = facilityType === "warehouse" ? 30 : 25

  return (
    <group>
      {/* Large factory floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[floorSize, 0.1, floorSize]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.8} />
      </mesh>

      {/* Corridors with numbers */}
      {Array.from({ length: corridors }).map((_, i) => {
        const xPos = -8 + i * 5
        return (
          <group key={i} position={[xPos, 0, 0]}>
            {/* Corridor surface */}
            <mesh position={[0, 0, 0]} receiveShadow>
              <boxGeometry args={[4, 0.15, 18]} />
              <meshStandardMaterial color="#334155" metalness={0.3} roughness={0.7} />
            </mesh>

            {/* Corridor number label */}
            <Text
              position={[0, 0.2, -9]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.8}
              color="#10b981"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Inter-Bold.ttf"
            >
              {i + 1}
            </Text>

            {/* Aisle markers */}
            {[-6, -3, 0, 3, 6].map((z, idx) => (
              <mesh key={idx} position={[-1.8, 0.16, z]}>
                <boxGeometry args={[0.3, 0.02, 0.3]} />
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
              </mesh>
            ))}
          </group>
        )
      })}

      {/* Grid helper for reference */}
      <gridHelper args={[floorSize, floorSize, "#475569", "#1e293b"]} />
    </group>
  )
}

function IndustrialMachine({ position = [0, 0, 0], type = "cnc", status = "operating" }: any) {
  const machineRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (machineRef.current && status === "operating") {
      const time = state.clock.getElapsedTime()
      machineRef.current.children[2].rotation.y = time * 2
    }
  })

  const statusColor = status === "operating" ? "#10b981" : status === "maintenance" ? "#f59e0b" : "#ef4444"

  return (
    <group ref={machineRef} position={position} scale={0.6}>
      {/* Base */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.5, 0.5, 1.2]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Main body */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[1.2, 1, 1]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Rotating part (if operating) */}
      <mesh position={[0, 1.2, 0.4]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Control panel */}
      <mesh position={[0.5, 1.2, -0.3]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.1]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Status light */}
      <mesh position={[0.5, 1.5, -0.29]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={3} />
        <pointLight intensity={0.4} distance={2} color={statusColor} />
      </mesh>
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
        <PerspectiveCamera makeDefault position={[15, 15, 15]} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={10}
          maxDistance={40}
          target={[0, 0, 0]}
        />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[15, 20, 15]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <spotLight position={[-15, 18, -10]} angle={0.3} penumbra={1} intensity={0.6} castShadow />
        <spotLight position={[15, 18, 10]} angle={0.3} penumbra={1} intensity={0.6} castShadow />
        <pointLight position={[0, 12, 0]} intensity={0.5} />

        <FactoryFloor corridors={facility?.corridors || 3} facilityType={facility?.type} />

        {facility?.type === "warehouse" && (
          <>
            <StorageRack position={[-10, 0, -8]} withPallets />
            <StorageRack position={[-10, 0, 0]} withPallets />
            <StorageRack position={[-10, 0, 8]} withPallets />
            <StorageRack position={[10, 0, -8]} withPallets />
            <StorageRack position={[10, 0, 0]} withPallets />
            <StorageRack position={[10, 0, 8]} withPallets />

            {/* Forklifts */}
            <Forklift position={[-5, 0, -3]} rotation={0} color="#2563eb" moving />
            <Forklift position={[5, 0, 3]} rotation={Math.PI} color="#10b981" />
          </>
        )}

        {facility?.type === "factory" && (
          <>
            <ConveyorBelt position={[-6, 0, 0]} length={8} active />
            <ConveyorBelt position={[0, 0, 0]} length={8} active />
            <ConveyorBelt position={[6, 0, 0]} length={8} active />
          </>
        )}

        {machines.map((machine, idx) => {
          const corridorWidth = 5
          const x = -8 + (machine.corridor - 1) * corridorWidth + (machine.position.x - 1) * 1.5
          const z = -7 + machine.position.y * 3

          return (
            <group key={machine.id} onClick={() => onMachineClick(machine)}>
              {machine.type === "robotic_arm" && (
                <RoboticArm
                  position={[x, 0, z]}
                  rotation={idx * 0.5}
                  color={
                    machine.status === "maintenance" ? "#f59e0b" : machine.status === "waiting" ? "#6366f1" : "#3b82f6"
                  }
                  status={machine.status}
                />
              )}

              {machine.type === "forklift" && (
                <Forklift
                  position={[x, 0, z]}
                  rotation={idx * 0.8}
                  color="#f59e0b"
                  moving={machine.status === "operating"}
                />
              )}

              {(machine.type === "cnc" || machine.type === "industrial") && (
                <IndustrialMachine position={[x, 0, z]} type={machine.type} status={machine.status} />
              )}
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
