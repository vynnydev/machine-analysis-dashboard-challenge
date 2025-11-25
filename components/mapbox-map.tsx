"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { getMapboxToken } from "@/app/actions/mapbox-token"

interface MapboxMapProps {
  markers?: Array<{
    id: string
    lng: number
    lat: number
    color?: string
    label?: string
    onClick?: () => void
  }>
  center?: [number, number]
  zoom?: number
  className?: string
}

export function MapboxMap({
  markers = [],
  center = [-46.633308, -23.55052],
  zoom = 12,
  className = "",
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [tokenLoaded, setTokenLoaded] = useState(false)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Fetch token from server action
    getMapboxToken().then((token) => {
      if (token) {
        mapboxgl.accessToken = token
        setTokenLoaded(true)
      }
    })
  }, [])

  const mapStyle =
    mounted && resolvedTheme === "light" ? "mapbox://styles/mapbox/streets-v12" : "mapbox://styles/mapbox/dark-v11"

  useEffect(() => {
    if (!mapContainer.current || !mounted || !tokenLoaded) return

    if (map.current) {
      map.current.remove()
      map.current = null
      markersRef.current = []
      setIsLoaded(false)
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: center,
        zoom: zoom,
      })

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

      map.current.on("load", () => {
        setIsLoaded(true)
      })

      map.current.on("error", (e) => {
        console.error("[v0] Erro ao carregar Mapbox:", e)
      })
    } catch (error) {
      console.error("[v0] Erro ao inicializar Mapbox:", error)
    }

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [center, zoom, mapStyle, mounted, tokenLoaded])

  useEffect(() => {
    if (!map.current || !isLoaded) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    markers.forEach((markerData) => {
      const el = document.createElement("div")
      el.className = "mapbox-marker"
      el.style.width = "24px"
      el.style.height = "24px"
      el.style.borderRadius = "50%"
      el.style.backgroundColor = markerData.color || "#3b82f6"
      el.style.border = "3px solid white"
      el.style.cursor = "pointer"
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)"

      if (markerData.onClick) {
        el.addEventListener("click", markerData.onClick)
      }

      const marker = new mapboxgl.Marker(el).setLngLat([markerData.lng, markerData.lat]).addTo(map.current!)

      if (markerData.label) {
        const popupBg = resolvedTheme === "light" ? "#fff" : "#1e293b"
        const popupColor = resolvedTheme === "light" ? "#000" : "#fff"
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="padding: 8px; font-size: 14px; font-weight: 600; color: ${popupColor}; background: ${popupBg}; border-radius: 4px;">${markerData.label}</div>`,
        )
        marker.setPopup(popup)
      }

      markersRef.current.push(marker)
    })
  }, [markers, isLoaded, resolvedTheme])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className={className} />
      {(!isLoaded || !tokenLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Carregando mapa...</p>
          </div>
        </div>
      )}
    </div>
  )
}
