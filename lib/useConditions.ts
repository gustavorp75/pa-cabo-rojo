'use client'
import { useState, useEffect } from 'react'

export interface Conditions {
  temp: { f: number; c: number }
  feelsLike: { f: number; c: number }
  wind: { mph: number; compass: string; conditionEs: string; conditionEn: string }
  waves: { ft: number; conditionEs: string; conditionEn: string }
  weather: { code: number; emoji: string; descEs: string; descEn: string }
  sunset: string
  ticker: { es: string; en: string }
  updatedAt: string
}

const CACHE_KEY = 'pcr-conditions'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export function useConditions() {
  const [data, setData] = useState<Conditions | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage cache first
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        const age = Date.now() - new Date(parsed.updatedAt).getTime()
        if (age < CACHE_TTL) {
          setData(parsed)
          setLoading(false)
          return
        }
      }
    } catch {}

    // Fetch fresh data
    fetch('/api/conditions')
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)) } catch {}
      })
      .catch(() => setLoading(false))
  }, [])

  return { data, loading }
}
