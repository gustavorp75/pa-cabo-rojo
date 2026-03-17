import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  // Allow public read for map visibility — POST still requires auth
  const db = getDb()
  const rows = await db`SELECT * FROM map_pin_overrides ORDER BY pin_id`
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { pin_id, visible } = await req.json()
  const db = getDb()
  await db`
    INSERT INTO map_pin_overrides (pin_id, visible, updated_at)
    VALUES (${pin_id}, ${visible}, NOW())
    ON CONFLICT (pin_id) DO UPDATE SET visible = EXCLUDED.visible, updated_at = NOW()
  `
  return NextResponse.json({ ok: true })
}
