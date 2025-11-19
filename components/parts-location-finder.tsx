"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { MapPin, Navigation, Clock, DollarSign, Star, Phone, X, Sparkles, TrendingDown, Package, Building2 } from 'lucide-react'
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
  partImage?: string
}

const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "AutoPeças Premium",
    address: "Rua das Indústrias, 450",
    city: "São Paulo - SP",
    distance: 2.3,
    duration: "8 min",
    price: 2250.00,
    originalPrice: 2800.00,
    discount: 20,
    rating: 4.8,
    reviews: 156,
    phone: "(11) 98765-4321",
    hours: "08:00 - 18:00",
    inStock: true,
    quantity: 5,
    coordinates: [-46.6333, -23.5505],
    image: "/parts-store-1.jpg"
  },
  {
    id: "2",
    name: "Oficina Central Peças",
    address: "Av. Paulista, 1200",
    city: "São Paulo - SP",
    distance: 4.1,
    duration: "15 min",
    price: 2180.00,
    originalPrice: 2600.00,
    discount: 16,
    rating: 4.9,
    reviews: 203,
    phone: "(11) 97654-3210",
    hours: "07:00 - 19:00",
    inStock: true,
    quantity: 3,
    coordinates: [-46.6567, -23.5629],
    image: "/parts-store-2.jpg"
  },
  {
    id: "3",
    name: "Industrial Parts Express",
    address: "Rua do Comércio, 890",
    city: "São Paulo - SP",
    distance: 5.8,
    duration: "22 min",
    price: 2450.00,
    originalPrice: 2900.00,
    discount: 15,
    rating: 4.6,
    reviews: 89,
    phone: "(11) 96543-2109",
    hours: "08:30 - 17:30",
    inStock: true,
    quantity: 2,
    coordinates: [-46.6189, -23.5475],
    image: "/parts-store-3.jpg"
  },
  {
    id: "4",
    name: "MegaPeças Distribuidora",
    address: "Av. Industrial, 2340",
    city: "São Paulo - SP",
    distance: 7.2,
    duration: "28 min",
    price: 2350.00,
    originalPrice: 2750.00,
    discount: 14,
    rating: 4.7,
    reviews: 124,
    phone: "(11) 95432-1098",
    hours: "09:00 - 18:00",
    inStock: true,
    quantity: 4,
    coordinates: [-46.6011, -23.5333],
    image: "/parts-store-4.jpg"
  },
  {
    id: "5",
    name: "TechParts Pro",
    address: "Rua dos Metalúrgicos, 567",
    city: "São Paulo - SP",
    distance: 9.5,
    duration: "35 min",
    price: 2520.00,
    originalPrice: 2950.00,
    discount: 15,
    rating: 4.5,
    reviews: 67,
    phone: "(11) 94321-0987",
    hours: "08:00 - 17:00",
    inStock: false,
    quantity: 0,
    coordinates: [-46.5822, -23.5189],
    image: "/parts-store-5.jpg"
  }
]

const userLocation: [number, number] = [-46.6389, -23.5489]

export function PartsLocationFinder({ isOpen, onClose, partName, partImage }: PartsLocationFinderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  useEffect(() => {
    if (!isOpen) return

    setIsLoading(true)
    setSelectedVendor(null)

    // Simulate AI search
    const timer = setTimeout(() => {
      setIsLoading(false)
      setSelectedVendor(mockVendors[0])
    }, 3000)

    return () => clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || isLoading) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: userLocation,
      zoom: 11,
      pitch: 45,
      bearing: 0,
    })

    mapRef.current = map

    map.on("load", () => {
      // Add user location marker
      const userMarker = document.createElement("div")
      userMarker.className = "user-location-marker"
      userMarker.style.width = "60px"
      userMarker.style.height = "60px"
      userMarker.style.borderRadius = "50%"
      userMarker.style.backgroundColor = "rgba(239, 68, 68, 0.3)"
      userMarker.style.border = "4px solid rgb(239, 68, 68)"
      userMarker.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.5)"

      new mapboxgl.Marker({ element: userMarker })
        .setLngLat(userLocation)
        .addTo(map)

      // Add vendor markers
      mockVendors.forEach((vendor) => {
        const el = document.createElement("div")
        el.className = "vendor-marker"
        el.style.width = "40px"
        el.style.height = "40px"
        el.style.borderRadius = "50%"
        el.style.backgroundColor = vendor.inStock ? "rgb(249, 115, 22)" : "rgb(156, 163, 175)"
        el.style.border = "3px solid white"
        el.style.cursor = "pointer"
        el.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)"
        el.style.display = "flex"
        el.style.alignItems = "center"
        el.style.justifyContent = "center"
        el.innerHTML = `<span style="color: white; font-size: 12px; font-weight: bold;">₵</span>`

        el.addEventListener("click", () => {
          setSelectedVendor(vendor)
        })

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(vendor.coordinates)
          .addTo(map)

        markersRef.current.push(marker)
      })

      if (selectedVendor) {
        drawRoute(map, selectedVendor)
      }
    })

    return () => {
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      map.remove()
    }
  }, [isOpen, isLoading, selectedVendor])

  const drawRoute = async (map: mapboxgl.Map, vendor: Vendor) => {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation[0]},${userLocation[1]};${vendor.coordinates[0]},${vendor.coordinates[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: "GET" }
    )
    const json = await query.json()
    const data = json.routes[0]
    const route = data.geometry.coordinates

    if (map.getSource("route")) {
      (map.getSource("route") as mapboxgl.GeoJSONSource).setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      })
    } else {
      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: route,
            },
          },
        },
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
    }

    const bounds = new mapboxgl.LngLatBounds()
    route.forEach((coord: [number, number]) => bounds.extend(coord))
    bounds.extend(userLocation)
    map.fitBounds(bounds, { padding: 100, duration: 1000 })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 gap-0 bg-slate-950">
        <div className="relative w-full h-full overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 opacity-50 blur-2xl animate-spin-slow" />
                </div>
                
                <div className="relative bg-slate-900/90 p-12 rounded-2xl border-4 border-transparent bg-clip-padding">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-orange-600 opacity-75 animate-gradient-x" 
                       style={{ 
                         padding: '4px',
                         WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                         WebkitMaskComposite: 'xor',
                         maskComposite: 'exclude'
                       }} 
                  />
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <Sparkles className="h-16 w-16 text-purple-400 animate-pulse" />
                        <div className="absolute inset-0 bg-purple-400 blur-xl opacity-50 animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-bold text-white">Analisando com IA</h3>
                      <p className="text-slate-300 max-w-md">
                        Buscando locais mais próximos com melhor custo-benefício para:
                      </p>
                      <p className="text-xl font-semibold text-purple-400">{partName}</p>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>

                    <div className="pt-4 space-y-2 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span>Analisando preços em tempo real...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span>Calculando melhores rotas...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span>Verificando disponibilidade de estoque...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div 
                ref={mapContainerRef} 
                className="absolute inset-0"
                style={{ filter: 'brightness(0.85)' }}
              />

              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute inset-0 border-8 border-transparent rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-cyan-600 opacity-30 animate-gradient-x" 
                     style={{
                       WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       WebkitMaskComposite: 'xor',
                       maskComposite: 'exclude',
                       padding: '8px'
                     }}
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 z-20 bg-slate-900/90 hover:bg-slate-800/90 text-white"
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="absolute top-4 left-4 z-20">
                <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-slate-400">Buscando peça:</p>
                      <p className="text-sm font-semibold text-white">{partName}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="absolute left-4 top-24 bottom-4 w-96 z-20 overflow-hidden">
                <Card className="h-full bg-slate-900/95 backdrop-blur-sm border-slate-700">
                  <CardContent className="p-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">Melhores Opções</h3>
                      <Badge className="bg-purple-600">{mockVendors.filter(v => v.inStock).length} disponíveis</Badge>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                      {mockVendors.map((vendor, index) => (
                        <Card
                          key={vendor.id}
                          className={`cursor-pointer transition-all hover:scale-[1.02] ${
                            selectedVendor?.id === vendor.id
                              ? "ring-2 ring-orange-500 bg-slate-800"
                              : "bg-slate-800/80 hover:bg-slate-800"
                          }`}
                          onClick={() => setSelectedVendor(vendor)}
                        >
                          <CardContent className="p-3">
                            <div className="flex gap-3">
                              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                                <img
                                  src={partImage || "/placeholder.svg"}
                                  alt={vendor.name}
                                  className="w-full h-full object-cover"
                                />
                                {index === 0 && (
                                  <div className="absolute top-1 right-1">
                                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-xs px-1 py-0">
                                      MELHOR
                                    </Badge>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="font-semibold text-white text-sm line-clamp-1">{vendor.name}</h4>
                                  <Badge
                                    variant={vendor.inStock ? "default" : "secondary"}
                                    className={`text-xs ml-2 flex-shrink-0 ${
                                      vendor.inStock ? "bg-green-600" : "bg-gray-600"
                                    }`}
                                  >
                                    {vendor.inStock ? "Disponível" : "Indisponível"}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-1 mb-2">
                                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                  <span className="text-xs text-slate-300">{vendor.rating}</span>
                                  <span className="text-xs text-slate-500">({vendor.reviews})</span>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Navigation className="h-3 w-3" />
                                    <span>{vendor.distance} km • {vendor.duration}</span>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="flex items-center gap-1">
                                        <span className="text-lg font-bold text-green-400">
                                          R$ {vendor.price.toFixed(2)}
                                        </span>
                                        <Badge variant="outline" className="text-xs border-green-600 text-green-400">
                                          <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
                                          {vendor.discount}%
                                        </Badge>
                                      </div>
                                      <span className="text-xs text-slate-500 line-through">
                                        R$ {vendor.originalPrice.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedVendor && (
                <div className="absolute right-4 bottom-4 w-[420px] z-20">
                  <Card className="bg-slate-900/95 backdrop-blur-sm border-orange-500 border-2">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">{selectedVendor.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-semibold text-white">{selectedVendor.rating}</span>
                            </div>
                            <span className="text-sm text-slate-400">({selectedVendor.reviews} avaliações)</span>
                          </div>
                        </div>
                        <Badge className="bg-green-600">Aberto</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                          <div className="flex items-center gap-2 mb-1">
                            <Navigation className="h-4 w-4 text-orange-500" />
                            <span className="text-xs text-slate-400">Distância</span>
                          </div>
                          <p className="text-lg font-bold text-white">{selectedVendor.distance} km</p>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-xs text-slate-400">Tempo</span>
                          </div>
                          <p className="text-lg font-bold text-white">{selectedVendor.duration}</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-300">Preço Final</span>
                          <Badge variant="outline" className="border-green-600 text-green-400">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            {selectedVendor.discount}% OFF
                          </Badge>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-green-400">
                            R$ {selectedVendor.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-slate-400 line-through">
                            R$ {selectedVendor.originalPrice.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Economia de R$ {(selectedVendor.originalPrice - selectedVendor.price).toFixed(2)}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <MapPin className="h-4 w-4 text-orange-500" />
                          <span>{selectedVendor.address}, {selectedVendor.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>{selectedVendor.hours}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Phone className="h-4 w-4 text-green-500" />
                          <span>{selectedVendor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Package className="h-4 w-4 text-purple-500" />
                          <span>{selectedVendor.quantity} unidades em estoque</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-800">
                          <Phone className="h-4 w-4" />
                          Ligar
                        </Button>
                        <Button className="gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600">
                          <Navigation className="h-4 w-4" />
                          Traçar Rota
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>

        <style jsx global>{`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgb(51, 65, 85);
            border-radius: 3px;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
