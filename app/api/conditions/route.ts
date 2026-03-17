import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

const LAT = 18.0003
const LNG = -67.1553

export async function GET() {
  try {
    const [weatherRes, marineRes, sunRes] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Puerto_Rico`,
        { next: { revalidate: 1800 } }),
      fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LNG}&current=wave_height,wave_direction&timezone=America/Puerto_Rico`,
        { next: { revalidate: 1800 } }),
      fetch(`https://api.sunrise-sunset.org/json?lat=${LAT}&lng=${LNG}&formatted=0`,
        { next: { revalidate: 3600 } }),
    ])

    const weather = await weatherRes.json()
    const marine  = await marineRes.json()
    const sun     = await sunRes.json()

    const tempF        = Math.round(weather.current?.temperature_2m ?? 82)
    const feelsF       = Math.round(weather.current?.apparent_temperature ?? 84)
    const windMph      = Math.round(weather.current?.wind_speed_10m ?? 10)
    const windDir      = weather.current?.wind_direction_10m ?? 90
    const weatherCode  = weather.current?.weather_code ?? 1
    const directions   = ['N','NE','E','SE','S','SW','W','NW']
    const compass      = directions[Math.round(windDir / 45) % 8]
    const waveM        = marine.current?.wave_height ?? 0.3
    const waveFt       = Math.round(waveM * 3.281 * 10) / 10

    const getWaveCondition = (ft: number) => {
      if (ft < 0.5) return { es: 'Calmado', en: 'Calm' }
      if (ft < 1.5) return { es: 'Ligero',  en: 'Light' }
      if (ft < 3.0) return { es: 'Moderado',en: 'Moderate' }
      return { es: 'Agitado', en: 'Rough' }
    }
    const getWindCondition = (mph: number) => {
      if (mph < 8)  return { es: 'Calma',    en: 'Calm' }
      if (mph < 15) return { es: 'Suave',    en: 'Light' }
      if (mph < 25) return { es: 'Moderado', en: 'Moderate' }
      return { es: 'Fuerte', en: 'Strong' }
    }
    const getWeatherDesc = (code: number) => {
      if (code === 0)  return { es: 'Despejado',          en: 'Clear' }
      if (code <= 2)   return { es: 'Parcialmente Nublado',en: 'Partly Cloudy' }
      if (code <= 3)   return { es: 'Nublado',            en: 'Cloudy' }
      if (code <= 49)  return { es: 'Niebla',             en: 'Foggy' }
      if (code <= 59)  return { es: 'Llovizna',           en: 'Drizzle' }
      if (code <= 69)  return { es: 'Lluvia',             en: 'Rain' }
      if (code <= 82)  return { es: 'Aguaceros',          en: 'Showers' }
      return { es: 'Tormenta', en: 'Storm' }
    }
    const getWeatherEmoji = (code: number) => {
      if (code === 0) return '☀️'
      if (code <= 2)  return '⛅'
      if (code <= 3)  return '☁️'
      if (code <= 49) return '🌫️'
      if (code <= 69) return '🌧️'
      if (code <= 82) return '🌦️'
      return '⛈️'
    }

    const waveCondition = getWaveCondition(waveFt)
    const windCondition = getWindCondition(windMph)
    const weatherDesc   = getWeatherDesc(weatherCode)
    const weatherEmoji  = getWeatherEmoji(weatherCode)

    const sunsetUTC = sun.results?.sunset
    let sunsetStr = '6:48 PM'
    if (sunsetUTC) {
      sunsetStr = new Date(sunsetUTC).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true,
        timeZone: 'America/Puerto_Rico',
      })
    }

    // ── FETCH CUSTOM TICKER + BEACH OVERRIDES FROM DB ──────
    let tickerCustomEs = ''
    let tickerCustomEn = ''
    let beachOverrides: Record<string, any> = {}
    let eventImpacts: Record<string, string> = {}

    try {
      const dbInstance = getDb()
      const [settings, overrides] = await Promise.all([
        dbInstance`SELECT key, value FROM site_settings WHERE key != 'admin_password'`,
        dbInstance`SELECT slug, condition, note_es, note_en, override_until FROM beach_overrides`,
      ])
      settings.forEach((s: any) => {
        if (s.key === 'ticker_custom_es') tickerCustomEs = s.value ?? ''
        if (s.key === 'ticker_custom_en') tickerCustomEn = s.value ?? ''
        if (s.key.startsWith('event_impact_')) {
          const zoneId = s.key.replace('event_impact_', '')
          eventImpacts[zoneId] = s.value ?? 'none'
        }
      })
      overrides.forEach((o: any) => {
        // Only apply override if not expired
        const expired = o.override_until && new Date(o.override_until) < new Date()
        if (!expired && o.condition) {
          beachOverrides[o.slug] = {
            condition: o.condition,
            noteEs: o.note_es,
            noteEn: o.note_en,
          }
        }
      })
    } catch {
      // DB unavailable — continue without overrides
    }

    // Build ticker
    const customEs = tickerCustomEs ? `${tickerCustomEs} · ` : ''
    const customEn = tickerCustomEn ? `${tickerCustomEn} · ` : ''

    const tickerES = `${customEs}${weatherEmoji} ${tempF}°F / ${Math.round((tempF-32)*5/9)}°C — ${weatherDesc.es} · 💨 Vientos ${windMph}mph ${compass} — ${windCondition.es} · 🌊 Mar ${waveCondition.es} — ${waveFt}ft · 🌅 Atardecer ${sunsetStr}      `
    const tickerEN = `${customEn}${weatherEmoji} ${tempF}°F / ${Math.round((tempF-32)*5/9)}°C — ${weatherDesc.en} · 💨 Winds ${windMph}mph ${compass} — ${windCondition.en} · 🌊 ${waveCondition.en} surf — ${waveFt}ft · 🌅 Sunset ${sunsetStr}      `

    return NextResponse.json({
      temp:        { f: tempF, c: Math.round((tempF-32)*5/9) },
      feelsLike:   { f: feelsF, c: Math.round((feelsF-32)*5/9) },
      wind:        { mph: windMph, compass, conditionEs: windCondition.es, conditionEn: windCondition.en },
      waves:       { ft: waveFt, conditionEs: waveCondition.es, conditionEn: waveCondition.en },
      weather:     { code: weatherCode, emoji: weatherEmoji, descEs: weatherDesc.es, descEn: weatherDesc.en },
      sunset:      sunsetStr,
      ticker:      { es: tickerES, en: tickerEN },
      beachOverrides,
      eventImpacts,
      updatedAt:   new Date().toISOString(),
    })

  } catch (err) {
    console.error('Conditions API error:', err)
    return NextResponse.json({
      temp:       { f: 82, c: 28 },
      feelsLike:  { f: 85, c: 29 },
      wind:       { mph: 12, compass: 'E', conditionEs: 'Suave', conditionEn: 'Light' },
      waves:      { ft: 0.5, conditionEs: 'Calmado', conditionEn: 'Calm' },
      weather:    { code: 1, emoji: '⛅', descEs: 'Parcialmente Nublado', descEn: 'Partly Cloudy' },
      sunset:     '6:48 PM',
      ticker:     { es: '⛅ 82°F / 28°C — Parcialmente Nublado · 💨 Vientos 12mph E · 🌊 Mar Calmado · 🌅 Atardecer 6:48 PM      ', en: '⛅ 82°F / 28°C — Partly Cloudy · 💨 Winds 12mph E · 🌊 Calm surf · 🌅 Sunset 6:48 PM      ' },
      beachOverrides: {},
      eventImpacts: {},
      updatedAt:  new Date().toISOString(),
    })
  }
}