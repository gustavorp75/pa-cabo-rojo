'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import { mapPins, pinTypeMeta, type PinType, type MapPin } from '@/lib/data'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

// Cabo Rojo center
const CENTER: [number, number] = [-67.170, 17.975]
const ZOOM = 11.5

export default function MapPage() {
  const { lang } = useLang()
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Map<string, any>>(new Map())
  const popupRef = useRef<mapboxgl.Popup | null>(null)

  const [activeTypes, setActiveTypes] = useState<Set<PinType>>(
    new Set(['beach', 'restaurant', 'bar', 'attraction', 'event'])
  )
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [hiddenPins, setHiddenPins] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/admin/pins', { headers: { 'x-admin-password': 'public' } })
      .then(r => r.ok ? r.json() : [])
      .then((rows: any[]) => {
        const hidden = new Set(rows.filter((r: any) => !r.visible).map((r: any) => r.pin_id as string))
        setHiddenPins(hidden)
      })
      .catch(() => {})
  }, [])

  const toggleType = (type: PinType) => {
    setActiveTypes(prev => {
      const next = new Set(prev)
      if (next.has(type)) { next.delete(type) } else { next.add(type) }
      return next
    })
  }

  // Init map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'your_mapbox_token_here') {
      setMapError(true)
      return
    }

    import('mapbox-gl').then(mapboxgl => {
      // inject mapbox CSS once
      if (!document.getElementById('mapbox-css')) {
        const link = document.createElement('link')
        link.id = 'mapbox-css'
        link.rel = 'stylesheet'
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css'
        document.head.appendChild(link)
      }
      ;(mapboxgl as any).default.accessToken = MAPBOX_TOKEN

      const map = new (mapboxgl as any).default.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: CENTER,
        zoom: ZOOM,
        attributionControl: false,
      })

      map.addControl(
        new (mapboxgl as any).default.AttributionControl({ compact: true }),
        'bottom-left'
      )

      map.on('load', () => {
        setMapLoaded(true)
        mapRef.current = map
      })

      // Scale markers on zoom — exact same pattern as findabathroomseattle
      map.on('zoom', () => {
        const scale = Math.max(0.45, Math.min(1.1, (map.getZoom() - 8) / 6))
        markersRef.current.forEach((marker: any) => {
          const wrap = marker.getElement()?.querySelector('.pcr-scale-wrap') as HTMLElement
          if (wrap) wrap.style.transform = `scale(${scale})`
        })
      })
    }).catch(() => setMapError(true))

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  // Add/update markers when filters or lang change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return

    import('mapbox-gl').then(mapboxgl => {
      // Remove existing markers
      markersRef.current.forEach(m => m.remove())
      markersRef.current.clear()

      const filtered = mapPins.filter(p => activeTypes.has(p.type) && !hiddenPins.has(p.id))

      const currentZoom = mapRef.current!.getZoom()
      const getScale = (z: number) => Math.max(0.45, Math.min(1.1, (z - 8) / 6))

      filtered.forEach(pin => {
        const el = document.createElement('div')
        el.style.cssText = 'cursor:pointer;'

        el.innerHTML = `
          <div class="pcr-scale-wrap" style="transform:scale(${getScale(currentZoom)});transform-origin:bottom center;transition:transform .15s ease;will-change:transform">
            <div style="position:relative;width:48px;height:60px">
              <img
                src="${pin.svgPin}"
                width="48"
                height="60"
                style="display:block;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.4));transition:filter .15s ease;"
                class="pcr-pin-img"
                alt="${pin.nameEn}"
              />
            </div>
          </div>
        `

        el.addEventListener('mouseenter', () => {
          const img = el.querySelector('.pcr-pin-img') as HTMLElement
          if (img) img.style.filter = 'drop-shadow(0 6px 10px rgba(0,0,0,0.6)) brightness(1.1)'
        })
        el.addEventListener('mouseleave', () => {
          const img = el.querySelector('.pcr-pin-img') as HTMLElement
          if (img) img.style.filter = 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))'
        })
        el.addEventListener('click', () => {
          setSelectedPin(pin)
          mapRef.current?.flyTo({ center: [pin.lng, pin.lat], zoom: 14, duration: 600 })
        })

        const marker = new (mapboxgl as any).default.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([pin.lng, pin.lat])
          .addTo(mapRef.current!)

        markersRef.current.set(pin.id, marker)
      })
    })
  }, [mapLoaded, activeTypes, lang])

  const visibleCount = mapPins.filter(p => activeTypes.has(p.type) && !hiddenPins.has(p.id)).length

  return (
    <div style={{ background: 'var(--cream)', height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />

      {/* ── FILTER BAR ── */}
      <div style={{ background: 'var(--ink)', borderBottom: '2px solid var(--teal)', flexShrink: 0, overflowX: 'auto', scrollbarWidth: 'none' } as React.CSSProperties}>
        <div style={{ display: 'flex', minWidth: 'max-content', padding: '0 4px' }}>
          {(Object.entries(pinTypeMeta) as [PinType, typeof pinTypeMeta[PinType]][]).map(([type, meta]) => {
            const active = activeTypes.has(type)
            const count = mapPins.filter(p => p.type === type).length
            return (
              <button key={type} onClick={() => toggleType(type)}
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '9px 12px', cursor: 'pointer', background: 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.3)',
                  borderBottom: active ? `3px solid ${meta.color}` : '3px solid transparent',
                  borderRight: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}>
                <img src={{
                  beach: '/images/icons/PinPCR_Red_BeachShell.webp',
                  restaurant: '/images/icons/Food2_PCR.webp',
                  bar: '/images/icons/Bar4_PCR.webp',
                  attraction: '/images/icons/Faro_PCR.webp',
                  event: '/images/icons/Event1_PCR.webp',
                }[type]} alt={lang === 'es' ? meta.es : meta.en}
                style={{ width: 20, height: 20, objectFit: 'contain', opacity: active ? 1 : 0.4 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
                <span>{lang === 'es' ? meta.es : meta.en}</span>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '0.85rem', color: active ? meta.color : 'rgba(255,255,255,0.2)', marginLeft: 2 }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── MAP ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* map container */}
        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

        {/* no token message */}
        {mapError && (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#0a3d52,#1a9b8a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🗺️</div>
            <div style={{ fontFamily: "'Libre Baskerville',serif", color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
              {lang === 'es' ? 'Mapa no disponible' : 'Map unavailable'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 280, marginBottom: 20 }}>
              {lang === 'es'
                ? 'Agrega tu token de Mapbox en .env.local para activar el mapa.'
                : 'Add your Mapbox token in .env.local to enable the map.'}
            </div>
            <code style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--teal-light)', fontSize: '0.7rem', padding: '8px 14px', borderRadius: 4, fontFamily: 'monospace' }}>
              NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
            </code>
          </div>
        )}

        {/* loading overlay */}
        {!mapLoaded && !mapError && (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#0a3d52,#1a9b8a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ fontSize: '2.5rem' }}>🗺️</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              {lang === 'es' ? 'Cargando mapa...' : 'Loading map...'}
            </div>
          </div>
        )}

        {/* pin count badge */}
        {mapLoaded && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--ink)', color: '#fff', borderRadius: 3, padding: '5px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {visibleCount} {lang === 'es' ? 'lugares' : 'places'}
            </span>
          </div>
        )}

        {/* recenter button */}
        {mapLoaded && (
          <button
            onClick={() => mapRef.current?.flyTo({ center: CENTER, zoom: ZOOM, duration: 800 })}
            style={{ position: 'absolute', top: 12, left: 12, background: 'var(--ink)', border: 'none', borderRadius: 3, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', fontSize: '1.1rem' }}>
            🎯
          </button>
        )}

        {/* ── SELECTED PIN CARD ── */}
        {selectedPin && (
          <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, background: 'var(--ink)', borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.4)', overflow: 'hidden', borderTop: `3px solid ${selectedPin.color}` }}>
            <div style={{ padding: '14px 14px 0' }}>
              {/* close */}
              <button onClick={() => setSelectedPin(null)}
                style={{ position: 'absolute', top: 10, right: 12, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', cursor: 'pointer', lineHeight: 1 }}>
                ✕
              </button>

              {/* type badge */}
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: selectedPin.color, marginBottom: 4 }}>
                {selectedPin.emoji} {lang === 'es' ? pinTypeMeta[selectedPin.type].es : pinTypeMeta[selectedPin.type].en}
              </div>

              {/* name */}
              <div style={{ fontFamily: "'Libre Baskerville',serif", color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: 3, paddingRight: 24 }}>
                {lang === 'es' ? selectedPin.nameEs : selectedPin.nameEn}
              </div>

              {/* tag */}
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>
                {lang === 'es' ? selectedPin.tagEs : selectedPin.tagEn}
              </div>
            </div>

            {/* actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <a href={selectedPin.mapLink} target="_blank" rel="noopener noreferrer"
                style={{ padding: '11px 14px', textAlign: 'center', textDecoration: 'none', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal-light)' }}>
                  📍 {lang === 'es' ? 'Cómo llegar' : 'Directions'}
                </span>
              </a>
              <button onClick={() => setSelectedPin(null)}
                style={{ padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                  {lang === 'es' ? 'Cerrar' : 'Close'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
