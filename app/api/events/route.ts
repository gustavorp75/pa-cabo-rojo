import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { events as staticEvents } from '@/lib/data'

export async function GET() {
  // Get today's date in Puerto Rico timezone
  const prNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Puerto_Rico' }))
  const today = prNow.toISOString().split('T')[0]
  const tomorrow = new Date(prNow)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  let dbEvents: any[] = []

  try {
    const db = getDb()
    const rows = await db`
      SELECT * FROM events
      WHERE active = true
        AND date >= ${today}
        AND date <= ${tomorrowStr}
      ORDER BY date ASC, time ASC
    `
    dbEvents = rows
  } catch {
    // DB not available — fall through to static events
  }

  // If we have DB events, return them formatted
  if (dbEvents.length > 0) {
    const formatted = dbEvents.map((e: any) => ({
      id:        String(e.id),
      time:      e.time,
      ampm:      e.ampm,
      nameEs:    e.name_es,
      nameEn:    e.name_en,
      whereEs:   e.where_es ?? '',
      whereEn:   e.where_en ?? '',
      descEs:    e.desc_es ?? '',
      descEn:    e.desc_en ?? '',
      category:  e.category ?? 'music',
      type:      e.type ?? 'free',
      labelEs:   e.label_es ?? 'Gratis',
      labelEn:   e.label_en ?? 'Free',
      recurs:    e.recurs ?? null,
      recursEn:  e.recurs_en ?? null,
      date:      e.date,
      isToday:   e.date === today,
      fromDB:    true,
    }))
    return NextResponse.json({ events: formatted, source: 'db', date: today })
  }

  // Fall back to static events from data.ts
  return NextResponse.json({
    events: staticEvents.map(e => ({ ...e, isToday: true, fromDB: false })),
    source: 'static',
    date: today,
  })
}
