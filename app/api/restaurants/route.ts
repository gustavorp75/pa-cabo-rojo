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

  // Static restaurants merged with DB overrides
  const staticResult = fullRestaurants.map(r => {
    const dbRow = dbRestaurants[r.id]
    const hours: WeekHours | null = dbRow?.hours ?? (r as any).hours ?? null

    let status: string
    if (dbRow?.status_override === 'open')        status = 'open'
    else if (dbRow?.status_override === 'closed') status = 'closed'
    else status = getOpenStatus(hours)

    const todayHours   = getTodayHours(hours)
    const hoursDisplay = getHoursDisplay(hours)
    const closeTime    = todayHours?.close ? formatTime(todayHours.close) : null

    return {
      ...r,
      name:          dbRow?.name          ?? r.name,
      description:   dbRow?.description   ?? (r as any).taglineEs ?? null,
      address:       dbRow?.address       ?? (r as any).locationEs ?? null,
      special_offer: dbRow?.special_offer ?? (r as any).specialOffer ?? null,
      stars:         dbRow?.stars         ?? r.stars,
      featured:      dbRow?.featured      ?? false,
      sponsored:     dbRow?.sponsored     ?? false,
      photo_url:     dbRow?.photo_url     ?? null,
      status, hoursDisplay, closeTime, hasHours: !!hours,
    }
  })

  // Dynamic restaurants — only in DB, not in data.ts
  const staticIds = new Set(fullRestaurants.map(r => r.id))
  const dynamicResult = Object.values(dbRestaurants)
    .filter((r: any) => !staticIds.has(r.slug))
    .map((r: any) => {
      const hours: WeekHours | null = r.hours ?? null
      let status: string
      if (r.status_override === 'open')        status = 'open'
      else if (r.status_override === 'closed') status = 'closed'
      else status = getOpenStatus(hours)

      const todayHours   = getTodayHours(hours)
      const hoursDisplay = getHoursDisplay(hours)
      const closeTime    = todayHours?.close ? formatTime(todayHours.close) : null

      return {
        id:           r.slug,
        name:         r.name,
        emoji:        '🍽️',
        img:          '/images/icons/Food2_PCR.webp',
        category:     r.category ?? 'casual',
        price:        r.price ?? '$$',
        taglineEs:    r.description ?? '',
        taglineEn:    r.description ?? '',
        locationEs:   r.address ?? 'Boquerón, PR',
        locationEn:   r.address ?? 'Boquerón, PR',
        mustTryEs:    '',
        mustTryEn:    '',
        stars:        r.stars ?? 4,
        phone:        r.phone ?? null,
        website:      r.website ?? null,
        mapLink:      `https://maps.google.com/?q=${encodeURIComponent(r.name + ' Boqueron Puerto Rico')}`,
        sponsored:    r.sponsored ?? false,
        featured:     r.featured ?? false,
        special_offer: r.special_offer ?? null,
        status, hoursDisplay, closeTime, hasHours: !!hours,
      }
    })

  return NextResponse.json([...staticResult, ...dynamicResult], {
    headers: { 'Cache-Control': 'no-store' }
  })
}
