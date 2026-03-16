import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const rows = await db`
    SELECT * FROM events
    WHERE date >= CURRENT_DATE
    ORDER BY date ASC, time ASC
  `
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = getDb()

  if (body.id) {
    // Update existing
    await db`
      UPDATE events SET
        date = ${body.date}, time = ${body.time}, ampm = ${body.ampm},
        name_es = ${body.name_es}, name_en = ${body.name_en},
        where_es = ${body.where_es ?? null}, where_en = ${body.where_en ?? null},
        desc_es = ${body.desc_es ?? null}, desc_en = ${body.desc_en ?? null},
        category = ${body.category ?? 'music'}, type = ${body.type ?? 'free'},
        label_es = ${body.label_es ?? 'Gratis'}, label_en = ${body.label_en ?? 'Free'},
        recurs = ${body.recurs ?? null}, recurs_en = ${body.recurs_en ?? null},
        active = ${body.active ?? true}
      WHERE id = ${body.id}
    `
  } else {
    // Insert new
    await db`
      INSERT INTO events (date, time, ampm, name_es, name_en, where_es, where_en, desc_es, desc_en, category, type, label_es, label_en, recurs, recurs_en, active)
      VALUES (${body.date}, ${body.time}, ${body.ampm}, ${body.name_es}, ${body.name_en},
        ${body.where_es ?? null}, ${body.where_en ?? null}, ${body.desc_es ?? null}, ${body.desc_en ?? null},
        ${body.category ?? 'music'}, ${body.type ?? 'free'},
        ${body.label_es ?? 'Gratis'}, ${body.label_en ?? 'Free'},
        ${body.recurs ?? null}, ${body.recurs_en ?? null}, ${body.active ?? true})
    `
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const db = getDb()
  await db`DELETE FROM events WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
