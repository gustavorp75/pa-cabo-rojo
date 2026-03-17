import type { Conditions } from './useConditions'

// ── ZONE DEFINITIONS ─────────────────────────────────────
export type ZoneType = 'beach' | 'nightlife' | 'attraction'
export type CrowdLevel = 'calm' | 'moderate' | 'busy' | 'very-busy'

export interface Zone {
  id: string
  nameEs: string
  nameEn: string
  type: ZoneType
  emoji: string
  img: string
  bestForEs: string
  bestForEn: string
  href: string
}

export const zones: Zone[] = [
  { id: 'boqueron-poblado', img: '/images/icons/PinPCR_Green_Music.webp', nameEs: 'Pueblo de Boquerón', nameEn: 'Boquerón Village',  type: 'nightlife',   emoji: '🎶', bestForEs: 'Comida · Bares · Ambiente', bestForEn: 'Food · Bars · Atmosphere', href: '/food' },
  { id: 'balneario', img: '/images/icons/PinPCR_Red_BeachShell.webp',        nameEs: 'Balneario Boquerón', nameEn: 'Balneario Beach',   type: 'beach',       emoji: '🏖️', bestForEs: 'Playa animada · Acceso fácil', bestForEn: 'Lively beach · Easy access', href: '/playas/balneario' },
  { id: 'playa-buye', img: '/images/icons/PinPCR_Red_BeachShell.webp',       nameEs: 'Playa Buyé',         nameEn: 'Playa Buyé',        type: 'beach',       emoji: '🌊', bestForEs: 'Familia · Agua clara', bestForEn: 'Family · Clear water', href: '/playas/playa-buye' },
  { id: 'combate', img: '/images/icons/PinPCR_Red_Palma.webp',          nameEs: 'Playa Combate',      nameEn: 'Combate Beach',     type: 'beach',       emoji: '🌅', bestForEs: 'Atardecer · Kitesurf', bestForEn: 'Sunset · Kite surfing', href: '/playas/combate' },
  { id: 'playa-sucia', img: '/images/icons/PinPCR_Red_Beach.webp',      nameEs: 'Playa Sucia',        nameEn: 'Playa Sucia',       type: 'beach',       emoji: '🏛️', bestForEs: 'Buceo · Tranquilidad', bestForEn: 'Snorkeling · Solitude', href: '/playas/playa-sucia' },
  { id: 'faro-morrillos', img: '/images/icons/PinPCR_Red_Faro.webp',   nameEs: 'Faro Los Morrillos', nameEn: 'Los Morrillos',     type: 'attraction',  emoji: '🔦', bestForEs: 'Atardecer · Fotos', bestForEn: 'Sunset · Photos', href: '/map' },
  { id: 'salinas', img: '/images/icons/PinPCR_Green_Flower.webp',          nameEs: 'Las Salinas',        nameEn: 'Salt Flats',        type: 'attraction',  emoji: '🌸', bestForEs: 'Naturaleza · Flamencos', bestForEn: 'Nature · Flamingos', href: '/map' },
]

// ── BASELINE SCORES (day + hour) ─────────────────────────
// Puerto Rico timezone: getDay() 0=Sun 6=Sat
// Returns 0-100 for how busy a zone typically is at this time

function getBaselineScore(zone: Zone, prDate: Date): number {
  const day  = prDate.getDay()   // 0=Sun
  const hour = prDate.getHours()
  const isWeekend  = day === 0 || day === 6
  const isFriday   = day === 5
  const isPeakAfternoon = hour >= 11 && hour <= 16
  const isEvening  = hour >= 18 && hour <= 23
  const isLateNight = hour >= 22 || hour <= 2
  const isMorning  = hour >= 6 && hour < 11

  switch (zone.type) {
    case 'beach':
      if (zone.id === 'balneario') {
        if (isWeekend && isPeakAfternoon) return 80
        if (isWeekend && isEvening)       return 50
        if (isWeekend && isMorning)       return 40
        if (!isWeekend && isPeakAfternoon) return 35
        return 20
      }
      if (zone.id === 'playa-sucia') {
        // Remote beach — always less crowded
        if (isWeekend && isPeakAfternoon) return 45
        if (isWeekend && isMorning)       return 20
        if (!isWeekend)                   return 15
        return 30
      }
      if (zone.id === 'playa-buye') {
        if (isWeekend && isPeakAfternoon) return 65
        if (isWeekend && isMorning)       return 35
        if (!isWeekend && isPeakAfternoon) return 30
        return 20
      }
      if (zone.id === 'combate') {
        // Sunset beach — peaks in evening
        if (isWeekend && isEvening)       return 70
        if (isWeekend && isPeakAfternoon) return 50
        if (isEvening)                    return 45
        return 20
      }
      return 30

    case 'nightlife':
      // Boquerón village peaks Friday/Saturday night
      if ((isWeekend || isFriday) && isLateNight) return 90
      if ((isWeekend || isFriday) && isEvening)   return 75
      if (isWeekend && isPeakAfternoon)            return 50
      if (!isWeekend && isEvening)                 return 35
      if (!isWeekend && isPeakAfternoon)           return 25
      return 10

    case 'attraction':
      if (zone.id === 'faro-morrillos') {
        // Peaks at sunset every day
        if (isEvening && hour <= 20) return 70
        if (isWeekend && isPeakAfternoon) return 50
        if (!isWeekend && isPeakAfternoon) return 35
        return 20
      }
      if (zone.id === 'salinas') {
        if (isWeekend && isMorning) return 55
        if (isWeekend && isPeakAfternoon) return 45
        if (!isWeekend && isMorning) return 30
        return 20
      }
      return 30
  }
}

// ── WEATHER SCORE ────────────────────────────────────────
// For beaches/attractions: nice weather = more crowded
// For nightlife: weather has less impact

function getWeatherScore(zone: Zone, wx: Conditions): number {
  const windMph     = wx.wind.mph
  const waveFt      = wx.waves.ft
  const weatherCode = wx.weather.code
  const isRainy     = weatherCode >= 60
  const isStormy    = weatherCode >= 80

  if (zone.type === 'nightlife') {
    // Rain actually drives people to covered bars
    if (isStormy) return 20
    if (isRainy)  return 40
    return 55  // weather matters less for nightlife
  }

  if (zone.type === 'beach') {
    if (isStormy) return 5
    if (isRainy)  return 15
    // Perfect beach day = more people
    const windPenalty = Math.min(windMph * 1.5, 40)
    const wavePenalty = Math.min(waveFt * 10, 30)
    const baseBeach = 85
    return Math.max(10, baseBeach - windPenalty - wavePenalty)
  }

  if (zone.type === 'attraction') {
    if (isStormy) return 10
    if (isRainy)  return 25
    // Faro at sunset is always good
    if (zone.id === 'faro-morrillos') {
      const windPenalty = Math.min(windMph * 0.8, 25)
      return Math.max(30, 80 - windPenalty)
    }
    const windPenalty = Math.min(windMph * 1.2, 35)
    return Math.max(15, 75 - windPenalty)
  }

  return 50
}

// ── EVENT SCORE ──────────────────────────────────────────
export type EventImpact = 'none' | 'light' | 'medium' | 'strong' | 'major'

const eventScores: Record<EventImpact, number> = {
  none:   0,
  light:  20,
  medium: 50,
  strong: 75,
  major:  95,
}

// ── MANUAL OVERRIDE ──────────────────────────────────────
// Admin can set -2 to +2 adjustment
// -2 = very quiet, -1 = quieter, 0 = neutral, +1 = busier, +2 = very busy
const manualAdjustments: Record<number, number> = {
  [-2]: -25,
  [-1]: -15,
  [0]:  0,
  [1]:  15,
  [2]:  30,
}

// ── MAIN SCORE CALCULATOR ────────────────────────────────
export interface CrowdScore {
  zoneId: string
  score: number           // 0-100
  level: CrowdLevel
  labelEs: string
  labelEn: string
  color: string
  confidence: 'high' | 'medium' | 'low'
  confidenceLabelEs: string
  confidenceLabelEn: string
  noteEs: string
  noteEn: string
  updatedMinsAgo: number
  alternativeId?: string  // suggest quieter alternative
}

function scoreToLevel(score: number): CrowdLevel {
  if (score < 25) return 'calm'
  if (score < 50) return 'moderate'
  if (score < 75) return 'busy'
  return 'very-busy'
}

const levelMeta: Record<CrowdLevel, { es: string; en: string; color: string }> = {
  'calm':      { es: 'Tranquilo',    en: 'Calm',      color: '#16a34a' },
  'moderate':  { es: 'Moderado',     en: 'Moderate',  color: '#2ba99a' },
  'busy':      { es: 'Concurrido',   en: 'Busy',      color: '#c9943a' },
  'very-busy': { es: 'Muy Lleno',    en: 'Very Busy', color: '#e05a3a' },
}

// Quieter alternatives for each zone
const alternatives: Record<string, string> = {
  'balneario':      'playa-buye',
  'playa-buye':     'playa-sucia',
  'boqueron-poblado': 'combate',
  'combate':        'playa-sucia',
  'faro-morrillos': 'salinas',
}

interface ScoreInputs {
  wx: Conditions | null
  eventImpact?: EventImpact
  manualAdj?: number  // -2 to 2
  updatedAt?: Date
}

export function calculateCrowdScore(zone: Zone, inputs: ScoreInputs): CrowdScore {
  const { wx, eventImpact = 'none', manualAdj = 0, updatedAt } = inputs

  // Get PR time
  const prNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Puerto_Rico' }))

  // Weights by zone type
  const weights = zone.type === 'nightlife'
    ? { baseline: 0.40, weather: 0.10, event: 0.35, manual: 0.15 }
    : zone.type === 'attraction'
    ? { baseline: 0.35, weather: 0.30, event: 0.20, manual: 0.15 }
    : { baseline: 0.35, weather: 0.35, event: 0.20, manual: 0.10 } // beach

  const baselineScore = getBaselineScore(zone, prNow)
  const weatherScore  = wx ? getWeatherScore(zone, wx) : 50
  const eventScore    = eventScores[eventImpact]
  const manualScore   = manualAdj !== 0 ? 50 + (manualAdjustments[manualAdj] ?? 0) : 50

  // Weighted average
  let total: number
  if (manualAdj !== 0) {
    total = (
      baselineScore * weights.baseline +
      weatherScore  * weights.weather  +
      eventScore    * weights.event    +
      manualScore   * weights.manual
    )
  } else {
    // No manual input — redistribute manual weight
    const w = { baseline: weights.baseline + 0.05, weather: weights.weather + 0.05, event: weights.event + 0.05 }
    total = (
      baselineScore * w.baseline +
      weatherScore  * w.weather  +
      eventScore    * w.event
    )
  }

  const score = Math.round(Math.min(100, Math.max(0, total)))
  const level = scoreToLevel(score)
  const meta  = levelMeta[level]

  // Confidence: high if we have weather + no stale data, low if baseline only
  const confidence = wx && (updatedAt ? (Date.now() - updatedAt.getTime()) < 45 * 60000 : true)
    ? 'high' : !wx ? 'low' : 'medium'

  const confLabels = {
    high:   { es: 'Alta confianza',   en: 'High confidence' },
    medium: { es: 'Media confianza',  en: 'Medium confidence' },
    low:    { es: 'Estimado',         en: 'Estimated' },
  }

  // Generate note
  const getNoteEs = (): string => {
    if (!wx) return 'Basado en patrones históricos'
    if (wx.weather.code >= 80) return 'Tormenta cercana — menos gente de lo normal'
    if (wx.weather.code >= 60) return 'Lluvia — tráfico reducido esperado'
    if (zone.type === 'nightlife') {
      if (level === 'very-busy') return 'Fin de semana en hora pico'
      if (level === 'calm') return 'Tranquilo, buen momento para salir'
      return 'Ambiente moderado'
    }
    if (zone.type === 'beach') {
      if (wx.wind.mph > 20) return `Vientos ${wx.wind.mph}mph — considera otra playa`
      if (level === 'calm') return 'Excelente momento para ir'
      if (level === 'very-busy') return 'Muy concurrido — considera Playa Sucia'
      return `Viento ${wx.wind.mph}mph ${wx.wind.compass} · Mar ${wx.waves.conditionEs}`
    }
    if (zone.type === 'attraction') {
      if (zone.id === 'faro-morrillos') return `Atardecer hoy a las ${wx.sunset}`
      return 'Buenas condiciones hoy'
    }
    return 'Condiciones normales'
  }

  const getNoteEn = (): string => {
    if (!wx) return 'Based on historical patterns'
    if (wx.weather.code >= 80) return 'Storm nearby — less crowded than usual'
    if (wx.weather.code >= 60) return 'Rain — reduced traffic expected'
    if (zone.type === 'nightlife') {
      if (level === 'very-busy') return 'Weekend peak hours'
      if (level === 'calm') return 'Quiet — great time to go'
      return 'Moderate atmosphere'
    }
    if (zone.type === 'beach') {
      if (wx.wind.mph > 20) return `${wx.wind.mph}mph winds — consider another beach`
      if (level === 'calm') return 'Great time to go'
      if (level === 'very-busy') return 'Very crowded — consider Playa Sucia'
      return `${wx.wind.mph}mph ${wx.wind.compass} winds · ${wx.waves.conditionEn} surf`
    }
    if (zone.type === 'attraction') {
      if (zone.id === 'faro-morrillos') return `Sunset tonight at ${wx.sunset}`
      return 'Good conditions today'
    }
    return 'Normal conditions'
  }

  const minsAgo = updatedAt ? Math.round((Date.now() - updatedAt.getTime()) / 60000) : 0

  return {
    zoneId: zone.id,
    score,
    level,
    labelEs: meta.es,
    labelEn: meta.en,
    color: meta.color,
    confidence,
    confidenceLabelEs: confLabels[confidence].es,
    confidenceLabelEn: confLabels[confidence].en,
    noteEs: getNoteEs(),
    noteEn: getNoteEn(),
    updatedMinsAgo: minsAgo,
    alternativeId: level === 'busy' || level === 'very-busy' ? alternatives[zone.id] : undefined,
  }
}

export function getAllCrowdScores(wx: Conditions | null, eventOverrides?: Record<string, EventImpact>): CrowdScore[] {
  return zones.map(zone => calculateCrowdScore(zone, {
    wx,
    eventImpact: eventOverrides?.[zone.id] ?? 'none',
    updatedAt: wx ? new Date(wx.updatedAt) : undefined,
  }))
}
