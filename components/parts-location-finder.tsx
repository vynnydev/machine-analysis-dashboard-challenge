"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation, Clock, Star, X, Sparkles, ZoomIn, ZoomOut, ChevronUp } from "lucide-react"
import { generateRouteGeometry } from "@/app/actions/map-actions"
import { getMapboxToken } from "@/app/actions/mapbox-token"
import { createPortal } from "react-dom"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface Vendor {
  id: string
  name: string
  address: string
  city: string
  distance: number
  duration: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  phone: string
  hours: string
  inStock: boolean
  quantity: number
  coordinates: [number, number]
  image: string
}

interface PartsLocationFinderProps {
  isOpen: boolean
  onClose: () => void
  partName: string
  partImage: string
}

export function PartsLocationFinder({ isOpen, onClose, partName, partImage }: PartsLocationFinderProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [tokenLoaded, setTokenLoaded] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showVendorCard, setShowVendorCard] = useState(false)
  const [routeCoordinates, setRouteCoordinates] = useState<Array<[number, number]>>([])
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [zoom, setZoom] = useState(12)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  const userLocation: [number, number] = [-46.633308, -23.55052]

  const vendors: Vendor[] = [
    {
      id: "1",
      name: "AutoPeças Premium",
      address: "Av. Paulista, 1000",
      city: "São Paulo",
      distance: 2.3,
      duration: "8 min",
      price: 2250.0,
      originalPrice: 2800.0,
      discount: 20,
      rating: 4.8,
      reviews: 156,
      phone: "(11) 3456-7890",
      hours: "08:00 - 18:00",
      inStock: true,
      quantity: 5,
      coordinates: [-46.6388, -23.5489],
      image: partImage || "/auto-parts-store.png",
    },
    {
      id: "2",
      name: "Oficina Central Peças",
      address: "Rua Augusta, 500",
      city: "São Paulo",
      distance: 4.1,
      duration: "15 min",
      price: 2180.0,
      originalPrice: 2600.0,
      discount: 16,
      rating: 4.9,
      reviews: 203,
      phone: "(11) 2345-6789",
      hours: "07:00 - 19:00",
      inStock: true,
      quantity: 3,
      coordinates: [-46.6539, -23.5558],
      image: partImage || "/mechanic-shop.jpg",
    },
    {
      id: "3",
      name: "Industrial Parts Express",
      address: "Av. do Estado, 2500",
      city: "São Paulo",
      distance: 5.8,
      duration: "22 min",
      price: 2350.0,
      originalPrice: 2750.0,
      discount: 15,
      rating: 4.6,
      reviews: 89,
      phone: "(11) 4567-8901",
      hours: "06:00 - 20:00",
      inStock: true,
      quantity: 8,
      coordinates: [-46.6158, -23.5428],
      image: partImage || "/industrial-parts.jpg",
    },
    {
      id: "4",
      name: "MegaPeças Distribuidora",
      address: "Rua da Mooca, 1200",
      city: "São Paulo",
      distance: 7.2,
      duration: "28 min",
      price: 2100.0,
      originalPrice: 2500.0,
      discount: 16,
      rating: 4.7,
      reviews: 134,
      phone: "(11) 5678-9012",
      hours: "08:00 - 17:00",
      inStock: true,
      quantity: 12,
      coordinates: [-46.5958, -23.5628],
      image: partImage || "/auto-parts-distributor.jpg",
    },
  ]

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

  // Initialize Mapbox map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || !mounted || !tokenLoaded) return

    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
      markersRef.current = []
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: userLocation,
      zoom: zoom,
    })

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    // Add user location marker
    const userEl = document.createElement("div")
    userEl.innerHTML = `
      <div style="
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #3b82f6, #60a5fa);
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s infinite;
      ">
        <div style="width: 12px; height: 12px; background: white; border-radius: 50%;"></div>
      </div>
    `
    new mapboxgl.Marker(userEl).setLngLat(userLocation).addTo(mapRef.current)

    // Add vendor markers
    vendors.forEach((vendor) => {
      const el = document.createElement("div")
      el.innerHTML = `
        <div style="
          width: 44px;
          height: 44px;
          background: #f97316;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
          font-weight: bold;
          color: #fff;
          font-size: 16px;
        ">
          ₵
        </div>
      `
      el.style.cursor = "pointer"
      el.addEventListener("click", () => handleVendorSelect(vendor))
      el.addEventListener("mouseenter", () => {
        el.firstElementChild?.setAttribute(
          "style",
          (el.firstElementChild?.getAttribute("style") || "") + "transform: scale(1.1);",
        )
      })
      el.addEventListener("mouseleave", () => {
        el.firstElementChild?.setAttribute(
          "style",
          (el.firstElementChild?.getAttribute("style") || "").replace("transform: scale(1.1);", ""),
        )
      })

      const marker = new mapboxgl.Marker(el).setLngLat(vendor.coordinates).addTo(mapRef.current!)
      markersRef.current.push(marker)
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current = []
    }
  }, [isOpen, mapStyle, mounted, tokenLoaded])

  // Draw route when selected vendor changes
  useEffect(() => {
    if (!mapRef.current || !selectedVendor || routeCoordinates.length === 0) return

    const sourceId = "route"
    const layerId = "route-layer"

    if (mapRef.current.getLayer(layerId)) {
      mapRef.current.removeLayer(layerId)
    }
    if (mapRef.current.getSource(sourceId)) {
      mapRef.current.removeSource(sourceId)
    }

    mapRef.current.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: routeCoordinates,
        },
      },
    })

    mapRef.current.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#f97316",
        "line-width": 5,
        "line-opacity": 0.8,
      },
    })

    const bounds = new mapboxgl.LngLatBounds()
    routeCoordinates.forEach((coord) => bounds.extend(coord as [number, number]))
    mapRef.current.fitBounds(bounds, { padding: 80 })
  }, [routeCoordinates, selectedVendor])

  const handleVendorSelect = async (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setShowVendorCard(true)
    setIsLoadingRoute(true)

    try {
      const route = await generateRouteGeometry(userLocation, vendor.coordinates)
      setRouteCoordinates(route)
    } catch (error) {
      console.error("Error generating route:", error)
    } finally {
      setIsLoadingRoute(false)
    }
  }

  const handleZoomIn = () => {
    if (mapRef.current) {
      const newZoom = Math.min(zoom + 1, 18)
      setZoom(newZoom)
      mapRef.current.setZoom(newZoom)
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      const newZoom = Math.max(zoom - 1, 8)
      setZoom(newZoom)
      mapRef.current.setZoom(newZoom)
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-[95vw] max-w-7xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Left Panel - Vendor List */}
        <div className="w-[400px] bg-white dark:bg-slate-800/50 border-r border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Melhores Opções</h2>
              <Badge className="bg-emerald-500 text-white">{vendors.length} disponíveis</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 dark:bg-slate-600 rounded-lg overflow-hidden">
                <img
                  src={partImage || "/placeholder.svg?height=48&width=48&query=machine part"}
                  alt={partName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">{partName}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">Buscando melhores preços...</p>
              </div>
              <Sparkles className="h-5 w-5 text-purple-500" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {vendors.map((vendor, index) => (
              <Card
                key={vendor.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                  selectedVendor?.id === vendor.id
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                    : "border-transparent bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600"
                }`}
                onClick={() => handleVendorSelect(vendor)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="relative w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={vendor.image || "/placeholder.svg"}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <Badge className="absolute top-1 left-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5">
                          TOP
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{vendor.name}</h3>
                        <Badge
                          variant="outline"
                          className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 text-[10px] flex-shrink-0"
                        >
                          OK
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-600 dark:text-slate-300">{vendor.rating}</span>
                        <span className="text-xs text-gray-400 dark:text-slate-500">({vendor.reviews})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-slate-400">
                        <Navigation className="h-3 w-3 text-orange-500" />
                        <span>{vendor.distance} km</span>
                        <span>•</span>
                        <span>{vendor.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          R$ {vendor.price.toFixed(2)}
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30 text-[10px]"
                        >
                          -{vendor.discount}%
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-slate-500 line-through">
                        R$ {vendor.originalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="flex-1 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full shadow-lg"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-white" />
          </Button>

          <div className="absolute top-4 right-16 z-20 flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              className="bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg shadow-lg text-gray-600 dark:text-white"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              className="bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg shadow-lg text-gray-600 dark:text-white"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>

          <div ref={mapContainerRef} className="absolute inset-0" />

          {!tokenLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Carregando mapa...</p>
              </div>
            </div>
          )}

          {showVendorCard && selectedVendor && (
            <Card className="absolute bottom-6 right-6 w-80 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-2xl z-10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-white">{selectedVendor.name}</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white"
                      onClick={() => setShowVendorCard(!showVendorCard)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white"
                      onClick={() => {
                        setSelectedVendor(null)
                        setShowVendorCard(false)
                        setRouteCoordinates([])
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm text-gray-600 dark:text-slate-300">{selectedVendor.rating}</span>
                  <span className="text-sm text-gray-400 dark:text-slate-500">({selectedVendor.reviews})</span>
                  <Badge className="ml-auto bg-emerald-500 text-white text-xs">Aberto</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 dark:bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-xs mb-1">
                      <Navigation className="h-3 w-3" />
                      Distância
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedVendor.distance} km</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-xs mb-1">
                      <Clock className="h-3 w-3" />
                      Tempo
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedVendor.duration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )

  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body)
  }

  return null
}
