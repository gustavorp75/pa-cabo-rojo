import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { fullRestaurants } from '@/lib/data'
import { getOpenStatus, getHoursDisplay, getTodayHours, formatTime } from '@/lib/openStatus'
import type { WeekHours } from '@/lib/openStatus'

export async function GET() {
  let dbRestaurants: Record<string, any> = {}

  try {
    const db = getDb()
    const rows = await db`
      SELECT slug, name, category, price, description, address,
             hours, status_override, special_offer, stars,
             featured, sponsored, active, photo_url
      FROM restaurants
      WHERE active = true
    `
    rows.forEach((r: any) => { dbRestaurants[r.slug] = r })
  } catch {
    // DB empty or unavailable — use data.ts only
  }

  const result = fullRestaurants.map(r => {
    const dbRow = dbRestaurants[r.id]
    const hours: WeekHours | null = dbRow?.hours ?? (r as any).hours ?? null

    // Status: manual override > calculated from hours
    let status: string
    if (dbRow?.status_override === 'open')   status = 'open'
    else if (dbRow?.status_override === 'closed') status = 'closed'
    else status = getOpenStatus(hours)

    const todayHours  = getTodayHours(hours)
    const hoursDisplay = getHoursDisplay(hours)
    const closeTime   = todayHours?.close ? formatTime(todayHours.close) : null

    return {
      ...r,
      // DB values override data.ts if present
      name:          dbRow?.name          ?? r.name,
      description:   dbRow?.description   ?? (r as any).taglineEs ?? null,
      address:       dbRow?.address       ?? (r as any).locationEs ?? null,
      special_offer: dbRow?.special_offer ?? (r as any).specialOffer ?? null,
      stars:         dbRow?.stars         ?? r.stars,
      featured:      dbRow?.featured      ?? false,
      sponsored:     dbRow?.sponsored     ?? false,
      photo_url:     dbRow?.photo_url     ?? null,
      // Live calculated fields
      status,
      hoursDisplay,
      closeTime,
      hasHours: !!hours,
    }
  })

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'no-store' }
  })
}
