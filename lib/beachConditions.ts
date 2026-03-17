import type { Conditions } from './useConditions'

export type BeachStatus = 'great' | 'good' | 'busy' | 'rough'

export interface BeachCondition {
  status: BeachStatus
  labelEs: string
  labelEn: string
  noteEs: string
  noteEn: string
  color: string
}

// Calculate real beach conditions from weather API data
export function getBeachConditions(wx: Conditions | null): Record<string, BeachCondition> {
  const dbOverrides = wx?.beachOverrides ?? {}

  // Fallback if no weather data yet
  if (!wx) {
    return {
      'playa-sucia':    { status: 'great', labelEs: '● Excelente', labelEn: '● Great',  noteEs: 'Cargando...', noteEn: 'Loading...', color: '#16a34a' },
      'playa-buye':     { status: 'great', labelEs: '● Calmado',   labelEn: '● Calm',   noteEs: 'Cargando...', noteEn: 'Loading...', color: '#16a34a' },
      'combate':        { status: 'good',  labelEs: '● Bueno',     labelEn: '● Good',   noteEs: 'Cargando...', noteEn: 'Loading...', color: '#c9943a' },
      'balneario':      { status: 'good',  labelEs: '● Bueno',     labelEn: '● Good',   noteEs: 'Cargando...', noteEn: 'Loading...', color: '#c9943a' },
    }
  }

  const windMph   = wx.wind.mph
  const waveFt    = wx.waves.ft
  const compass   = wx.wind.compass  // N NE E SE S SW W NW
  const weatherCode = wx.weather.code

  const isStormy   = weatherCode >= 80
  const isRainy    = weatherCode >= 60 && weatherCode < 80
  const eastWind   = ['E','NE','SE'].includes(compass)
  const westWind   = ['W','NW','SW'].includes(compass)

  // ── PLAYA SUCIA ──────────────────────────────────────────
  // Sheltered on east side of peninsula, mostly affected by wave height
  // Best when: low waves, any wind direction, clear weather
  let susicaStatus: BeachStatus
  let sucicaNoteEs: string
  let sucicaNoteEn: string

  if (isStormy) {
    susicaStatus = 'rough'
    sucicaNoteEs = 'Tormenta — no recomendado'
    sucicaNoteEn = 'Storm — not recommended'
  } else if (waveFt >= 3 || windMph >= 25) {
    susicaStatus = 'good'
    sucicaNoteEs = `Oleaje ${waveFt}ft — snorkel limitado`
    sucicaNoteEn = `${waveFt}ft swell — limited snorkeling`
  } else if (waveFt <= 1 && windMph <= 15) {
    susicaStatus = 'great'
    sucicaNoteEs = `Mar calmado — visibilidad perfecta para buceo`
    sucicaNoteEn = `Calm water — perfect snorkel visibility`
  } else {
    susicaStatus = 'great'
    sucicaNoteEs = `Condiciones buenas · Oleaje ${waveFt}ft`
    sucicaNoteEn = `Good conditions · ${waveFt}ft swell`
  }

  // ── PLAYA BUYÉ ───────────────────────────────────────────
  // Very sheltered bay, almost always calm
  // Only rough in strong storms or very high swell
  let buyeStatus: BeachStatus
  let buyeNoteEs: string
  let buyeNoteEn: string

  if (isStormy) {
    buyeStatus = 'good'
    buyeNoteEs = 'Tormenta cerca — precaución'
    buyeNoteEn = 'Storm nearby — use caution'
  } else if (waveFt >= 4 || windMph >= 30) {
    buyeStatus = 'good'
    buyeNoteEs = `Viento ${windMph}mph — algo de oleaje`
    buyeNoteEn = `${windMph}mph winds — some chop`
  } else {
    buyeStatus = 'great'
    buyeNoteEs = `Agua clara · Ideal para niños`
    buyeNoteEn = `Clear water · Ideal for kids`
  }

  // ── COMBATE ──────────────────────────────────────────────
  // Wide open west-facing beach, very wind sensitive
  // East winds blow offshore = calm · West winds = choppy
  let combateStatus: BeachStatus
  let combateNoteEs: string
  let combateNoteEn: string

  if (isStormy) {
    combateStatus = 'rough'
    combateNoteEs = 'Tormenta — no recomendado'
    combateNoteEn = 'Storm — not recommended'
  } else if (westWind && windMph >= 15) {
    combateStatus = 'good'
    combateNoteEs = `Viento ${windMph}mph del ${compass} — algo agitado`
    combateNoteEn = `${windMph}mph ${compass} winds — some chop`
  } else if (windMph >= 25) {
    combateStatus = 'good'
    combateNoteEs = `Viento fuerte ${windMph}mph — bueno para kitesurf`
    combateNoteEn = `Strong ${windMph}mph winds — great for kite surfing`
  } else if (eastWind || windMph <= 12) {
    combateStatus = 'great'
    combateNoteEs = `Viento ${windMph}mph ${compass} — excelente atardecer hoy`
    combateNoteEn = `${windMph}mph ${compass} winds — great sunset today`
  } else {
    combateStatus = 'great'
    combateNoteEs = `Buenas condiciones · Atardecer ${wx.sunset}`
    combateNoteEn = `Good conditions · Sunset ${wx.sunset}`
  }

  // ── BALNEARIO BOQUERÓN ───────────────────────────────────
  // Inside the bay, very protected — condition is mostly about crowd level
  // Weekend = busy, weekday = good, storm = good (still protected)
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Puerto_Rico' }))
  const dayOfWeek = now.getDay() // 0=Sun, 6=Sat
  const hour = now.getHours()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const isPeakHour = hour >= 10 && hour <= 16

  let balnearioStatus: BeachStatus
  let balnearioNoteEs: string
  let balnearioNoteEn: string

  if (isStormy) {
    balnearioStatus = 'good'
    balnearioNoteEs = 'Lluvia cercana — menos gente hoy'
    balnearioNoteEn = 'Rain nearby — less crowded today'
  } else if (isWeekend && isPeakHour) {
    balnearioStatus = 'busy'
    balnearioNoteEs = 'Fin de semana — espera multitudes 10am-4pm'
    balnearioNoteEn = 'Weekend — expect crowds 10am-4pm'
  } else if (isWeekend) {
    balnearioStatus = 'good'
    balnearioNoteEs = 'Fin de semana pero fuera de hora pico'
    balnearioNoteEn = 'Weekend but off peak hours'
  } else {
    balnearioStatus = 'great'
    balnearioNoteEs = 'Entre semana — poca gente, fácil estacionamiento'
    balnearioNoteEn = 'Weekday — low crowds, easy parking'
  }

  // Helper to get label and color from status
  const getLabel = (status: BeachStatus, es: string, en: string, note_es: string, note_en: string): BeachCondition => {
    const colors: Record<BeachStatus, string> = {
      great: '#16a34a',
      good:  '#c9943a',
      busy:  '#e05a3a',
      rough: '#dc2626',
    }
    const labelsEs: Record<BeachStatus, string> = {
      great: '● Excelente',
      good:  '● Bueno',
      busy:  '● Lleno',
      rough: '● Agitado',
    }
    const labelsEn: Record<BeachStatus, string> = {
      great: '● Great',
      good:  '● Good',
      busy:  '● Busy',
      rough: '● Rough',
    }
    return {
      status,
      labelEs: labelsEs[status],
      labelEn: labelsEn[status],
      noteEs: note_es,
      noteEn: note_en,
      color: colors[status],
    }
  }

  const calculated = {
    'playa-sucia': getLabel(susicaStatus,  '', '', sucicaNoteEs, sucicaNoteEn),
    'playa-buye':  getLabel(buyeStatus,    '', '', buyeNoteEs,   buyeNoteEn),
    'combate':     getLabel(combateStatus, '', '', combateNoteEs, combateNoteEn),
    'balneario':   getLabel(balnearioStatus, '', '', balnearioNoteEs, balnearioNoteEn),
  }

  // Apply DB overrides — admin manual settings take priority
  const result: Record<string, BeachCondition> = { ...calculated }
  for (const [slug, override] of Object.entries(dbOverrides)) {
    if (override.condition && result[slug]) {
      result[slug] = getLabel(
        override.condition as BeachStatus, '', '',
        override.noteEs ?? result[slug].noteEs,
        override.noteEn ?? result[slug].noteEn,
      )
    }
  }
  return result
}
