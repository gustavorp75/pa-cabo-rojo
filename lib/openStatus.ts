// Calculates real open/closed status from hours data
// Uses Puerto Rico timezone (America/Puerto_Rico = AST, UTC-4, no DST)

export type OpenStatus = 'open' | 'closing-soon' | 'closed' | 'unknown'

export interface DayHours {
  open: string   // '11:00' 24h format
  close: string  // '22:00' 24h format
  closed: boolean
}

export type WeekHours = Record<
  'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
  DayHours
>

const DAYS = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'] as const

function parseTime(t: string): number {
  // Returns minutes since midnight
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m || 0)
}

function getPRNow(): { dayIndex: number; minutesSinceMidnight: number } {
  const prDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Puerto_Rico' }))
  return {
    dayIndex: prDate.getDay(), // 0=Sun
    minutesSinceMidnight: prDate.getHours() * 60 + prDate.getMinutes(),
  }
}

export function getOpenStatus(hours: WeekHours | null | undefined): OpenStatus {
  if (!hours) return 'unknown'

  const { dayIndex, minutesSinceMidnight } = getPRNow()
  const todayKey = DAYS[dayIndex]
  const todayHours = hours[todayKey]

  if (!todayHours || todayHours.closed) return 'closed'

  const openMin  = parseTime(todayHours.open)
  const closeMin = parseTime(todayHours.close)

  // Handle overnight hours (e.g. open 10:00, close 02:00 next day)
  const overnight = closeMin < openMin

  let isOpen: boolean
  if (overnight) {
    isOpen = minutesSinceMidnight >= openMin || minutesSinceMidnight < closeMin
  } else {
    isOpen = minutesSinceMidnight >= openMin && minutesSinceMidnight < closeMin
  }

  if (!isOpen) return 'closed'

  // Closing soon = within 45 minutes of closing
  const minsUntilClose = overnight && minutesSinceMidnight >= openMin
    ? (closeMin + 1440) - minutesSinceMidnight
    : closeMin - minutesSinceMidnight

  if (minsUntilClose <= 45) return 'closing-soon'
  return 'open'
}

export function getStatusLabel(status: OpenStatus, closeTime?: string, lang: string = 'es'): {
  text: string
  color: string
} {
  const labels = {
    es: {
      open:          { text: 'Abierto',        color: '#16a34a' },
      'closing-soon':{ text: closeTime ? `Cierra ${formatTime(closeTime)}` : 'Cierra pronto', color: '#c9943a' },
      closed:        { text: 'Cerrado',         color: '#e05a3a' },
      unknown:       { text: '',                color: '#7a9a7a' },
    },
    en: {
      open:          { text: 'Open',            color: '#16a34a' },
      'closing-soon':{ text: closeTime ? `Closes ${formatTime(closeTime)}` : 'Closing soon', color: '#c9943a' },
      closed:        { text: 'Closed',          color: '#e05a3a' },
      unknown:       { text: '',                color: '#7a9a7a' },
    },
  }
  return labels[lang as 'es' | 'en']?.[status] ?? labels.en[status]
}

export function getTodayHours(hours: WeekHours | null | undefined): DayHours | null {
  if (!hours) return null
  const { dayIndex } = getPRNow()
  return hours[DAYS[dayIndex]] ?? null
}

export function formatTime(t: string): string {
  // '22:00' → '10pm', '11:30' → '11:30am'
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 || 12
  return m ? `${hour}:${String(m).padStart(2,'0')}${ampm}` : `${hour}${ampm}`
}

export function getHoursDisplay(hours: WeekHours | null | undefined, lang: string = 'es'): string {
  // Returns a short string like "11am–10pm" for today
  const today = getTodayHours(hours)
  if (!today) return ''
  if (today.closed) return lang === 'es' ? 'Cerrado hoy' : 'Closed today'
  return `${formatTime(today.open)}–${formatTime(today.close)}`
}
