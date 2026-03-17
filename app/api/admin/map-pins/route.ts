import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyAdmin } from '@/lib/adminAuth'

// Table for dynamically added map pins (from admin, not data.ts)
export async function GET(req: NextRequest) {
  const db = getDb()
  try {
    const rows = await db`SELECT * FROM dynamic_map_pins WHERE active = true ORDER BY name_es`
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = getDb()

  try {
    await db`
      INSERT INTO dynamic_map_pins (
        pin_id, name_es, name_en, type, lat, lng,
        svg_pin, tag_es, tag_en, map_link, active, updated_at
      ) VALUES (
        ${body.id}, ${body.nameEs}, ${body.nameEn}, ${body.type},
        ${body.lat}, ${body.lng}, ${body.svgPin},
        ${body.tagEs ?? ''}, ${body.tagEn ?? ''},
        ${body.mapLink ?? ''}, ${true}, NOW()
      )
      ON CONFLICT (pin_id) DO UPDATE SET
        name_es = EXCLUDED.name_es, name_en = EXCLUDED.name_en,
        type = EXCLUDED.type, lat = EXCLUDED.lat, lng = EXCLUDED.lng,
        svg_pin = EXCLUDED.svg_pin, tag_es = EXCLUDED.tag_es,
        tag_en = EXCLUDED.tag_en, map_link = EXCLUDED.map_link,
        active = EXCLUDED.active, updated_at = NOW()
    `
    return NextResponse.json({ ok: true })
  } catch {
    // Table may not exist yet — create it
    await db`
      CREATE TABLE IF NOT EXISTS dynamic_map_pins (
        id          SERIAL PRIMARY KEY,
        pin_id      TEXT UNIQUE NOT NULL,
        name_es     TEXT NOT NULL,
        name_en     TEXT NOT NULL,
        type        TEXT DEFAULT 'restaurant',
        lat         NUMERIC(10,6) NOT NULL,
        lng         NUMERIC(10,6) NOT NULL,
        svg_pin     TEXT,
        tag_es      TEXT,
        tag_en      TEXT,
        map_link    TEXT,
        active      BOOLEAN DEFAULT TRUE,
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `
    // Retry insert
    await db`
      INSERT INTO dynamic_map_pins (pin_id, name_es, name_en, type, lat, lng, svg_pin, tag_es, tag_en, map_link, active, updated_at)
      VALUES (${body.id}, ${body.nameEs}, ${body.nameEn}, ${body.type}, ${body.lat}, ${body.lng}, ${body.svgPin}, ${body.tagEs ?? ''}, ${body.tagEn ?? ''}, ${body.mapLink ?? ''}, ${true}, NOW())
      ON CONFLICT (pin_id) DO NOTHING
    `
    return NextResponse.json({ ok: true })
  }
}

export async function DELETE(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { pin_id } = await req.json()
  const db = getDb()
  await db`UPDATE dynamic_map_pins SET active = false WHERE pin_id = ${pin_id}`
  return NextResponse.json({ ok: true })
}
