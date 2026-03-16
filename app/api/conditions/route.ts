import { NextResponse } from 'next/server'

// Cabo Rojo / Boquerón coordinates
const LAT = 18.0003
const LNG = -67.1553

export async function GET() {
  try {
    // Fetch weather + wind in parallel
    const [weatherRes, marineRes, sunRes] = await Promise.all([
      // Open-Meteo weather API - temp, wind, wind direction
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Puerto_Rico`,
        { next: { revalidate: 1800 } } // cache 30 minutes
      ),
      // Open-Meteo Marine API - wave height
      fetch(
        `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LNG}&current=wave_height,wave_direction&timezone=America/Puerto_Rico`,
        { next: { revalidate: 1800 } }
      ),
      // Sunrise-sunset API
      fetch(
        `https://api.sunrise-sunset.org/json?lat=${LAT}&lng=${LNG}&formatted=0`,
        { next: { revalidate: 3600 } } // cache 1 hour
      ),
    ])

    const weather = await weatherRes.json()
    const marine = await marineRes.json()
    const sun = await sunRes.json()

    // Parse weather
    const tempF = Math.round(weather.current?.temperature_2m ?? 82)
    const feelsF = Math.round(weather.current?.apparent_temperature ?? 84)
    const windMph = Math.round(weather.current?.wind_speed_10m ?? 10)
    const windDir = weather.current?.wind_direction_10m ?? 90
    const weatherCode = weather.current?.weather_code ?? 1

    // Wind direction to compass
    const directions = ['N','NE','E','SE','S','SW','W','NW']
    const compass = directions[Math.round(windDir / 45) % 8]

    // Wave height in feet
    const waveM = marine.current?.wave_height ?? 0.3
    const waveFt = Math.round(waveM * 3.281 * 10) / 10

    // Wave condition label
    const getWaveCondition = (ft: number) => {
      if (ft < 0.5) return { es: 'Calmado', en: 'Calm' }
      if (ft < 1.5) return { es: 'Ligero', en: 'Light' }
      if (ft < 3.0) return { es: 'Moderado', en: 'Moderate' }
      return { es: 'Agitado', en: 'Rough' }
    }
    const waveCondition = getWaveCondition(waveFt)

    // Wind condition
    const getWindCondition = (mph: number) => {
      if (mph < 8)  return { es: 'Calma', en: 'Calm' }
      if (mph < 15) return { es: 'Suave', en: 'Light' }
      if (mph < 25) return { es: 'Moderado', en: 'Moderate' }
      return { es: 'Fuerte', en: 'Strong' }
    }
    const windCondition = getWindCondition(windMph)

    // Weather description from code
    const getWeatherDesc = (code: number) => {
      if (code === 0) return { es: 'Despejado', en: 'Clear' }
      if (code <= 2)  return { es: 'Parcialmente Nublado', en: 'Partly Cloudy' }
      if (code <= 3)  return { es: 'Nublado', en: 'Cloudy' }
      if (code <= 49) return { es: 'Niebla', en: 'Foggy' }
      if (code <= 59) return { es: 'Llovizna', en: 'Drizzle' }
      if (code <= 69) return { es: 'Lluvia', en: 'Rain' }
      if (code <= 79) return { es: 'Nieve', en: 'Snow' }
      if (code <= 82) return { es: 'Aguaceros', en: 'Showers' }
      return { es: 'Tormenta', en: 'Storm' }
    }
    const weatherDesc = getWeatherDesc(weatherCode)

    // Weather emoji
    const getWeatherEmoji = (code: number) => {
      if (code === 0) return '☀️'
      if (code <= 2)  return '⛅'
      if (code <= 3)  return '☁️'
      if (code <= 49) return '🌫️'
      if (code <= 69) return '🌧️'
      if (code <= 82) return '🌦️'
      return '⛈️'
    }
    const weatherEmoji = getWeatherEmoji(weatherCode)

    // Parse sunset — comes as UTC ISO string, convert to PR time
    const sunsetUTC = sun.results?.sunset
    let sunsetStr = '6:48 PM'
    if (sunsetUTC) {
      const sunsetDate = new Date(sunsetUTC)
      sunsetStr = sunsetDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Puerto_Rico',
      })
    }

    // Build ticker text
    const tickerES = `${weatherEmoji} ${tempF}°F / ${Math.round((tempF - 32) * 5/9)}°C — ${weatherDesc.es} · 💨 Vientos ${windMph} mph ${compass} — ${windCondition.es} · 🌊 Mar ${waveCondition.es} — ${waveFt}ft · 🌅 Atardecer ${sunsetStr} — Ve a Los Morrillos · 🅿️ Estacionamiento disponible en Buyé      `
    const tickerEN = `${weatherEmoji} ${tempF}°F / ${Math.round((tempF - 32) * 5/9)}°C — ${weatherDesc.en} · 💨 Winds ${windMph} mph ${compass} — ${windCondition.en} · 🌊 ${waveCondition.en} surf — ${waveFt}ft · 🌅 Sunset ${sunsetStr} — Head to Los Morrillos · 🅿️ Parking available at Buyé      `

    return NextResponse.json({
      temp: { f: tempF, c: Math.round((tempF - 32) * 5/9) },
      feelsLike: { f: feelsF, c: Math.round((feelsF - 32) * 5/9) },
      wind: { mph: windMph, compass, conditionEs: windCondition.es, conditionEn: windCondition.en },
      waves: { ft: waveFt, conditionEs: waveCondition.es, conditionEn: waveCondition.en },
      weather: { code: weatherCode, emoji: weatherEmoji, descEs: weatherDesc.es, descEn: weatherDesc.en },
      sunset: sunsetStr,
      ticker: { es: tickerES, en: tickerEN },
      updatedAt: new Date().toISOString(),
    })

  } catch (err) {
    console.error('Conditions API error:', err)
    // Return sensible fallback if APIs fail
    return NextResponse.json({
      temp: { f: 82, c: 28 },
      feelsLike: { f: 85, c: 29 },
      wind: { mph: 12, compass: 'E', conditionEs: 'Suave', conditionEn: 'Light' },
      waves: { ft: 0.5, conditionEs: 'Calmado', conditionEn: 'Calm' },
      weather: { code: 1, emoji: '⛅', descEs: 'Parcialmente Nublado', descEn: 'Partly Cloudy' },
      sunset: '6:48 PM',
      ticker: {
        es: '⛅ 82°F / 28°C — Parcialmente Nublado · 💨 Vientos 12 mph E · 🌊 Mar Calmado · 🌅 Atardecer 6:48 PM — Ve a Los Morrillos      ',
        en: '⛅ 82°F / 28°C — Partly Cloudy · 💨 Winds 12 mph E · 🌊 Calm surf · 🌅 Sunset 6:48 PM — Head to Los Morrillos      ',
      },
      updatedAt: new Date().toISOString(),
    })
  }
}
