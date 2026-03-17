import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { fullRestaurants } from '@/lib/data'
import { getOpenStatus, getHoursDisplay, getTodayHours, formatTime } from '@/lib/openStatus'
import type { WeekHours } from '@/lib/openStatus'

export async function GET() {
  // Try to get hours from DB first, fall back to data.ts
  let dbRestaurants: Record<string, any> = {}

  try {
    const db = getDb()
    const rows = await db`
      SELECT slug, name, hours, status_override, special_offer, featured, active
      FROM restaurants
      WHERE active = true
    `
    rows.forEach((r: any) => {
      dbRestaurants[r.slug] = r
    })
  } catch {
    // DB not available or table empty — use data.ts only
  }

  const result = fullRestaurants.map(r => {
    const dbRow = dbRestaurants[r.id]

    // Hours: prefer DB, fall back to data.ts hours field
    const hours: WeekHours | null = dbRow?.hours ?? (r as any).hours ?? null

    // Status: check for manual override first
    let status: string
    if (dbRow?.status_override === 'open') {
      status = 'open'
    } else if (dbRow?.status_override === 'closed') {
      status = 'closed'
    } else {
      status = getOpenStatus(hours)
    }

    const todayHours = getTodayHours(hours)
    const hoursDisplay = getHoursDisplay(hours)
    const closeTime = todayHours?.close ?? null

    return {
      ...r,
      // Override with DB data if available
      name:          dbRow?.name ?? r.name,
      special_offer: dbRow?.special_offer ?? (r as any).specialOffer ?? null,
      featured:      dbRow?.featured ?? false,
      // Live status
      status,
      hoursDisplay,
      closeTime: closeTime ? formatTime(closeTime) : null,
      hasHours: !!hours,
    }
  })

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'no-store' } // always fresh — PR time matters
  })
}
