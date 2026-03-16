import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const rows = await db`SELECT * FROM beach_overrides ORDER BY slug`
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug, condition, note_es, note_en, override_until } = await req.json()
  const db = getDb()
  await db`
    INSERT INTO beach_overrides (slug, condition, note_es, note_en, override_until, updated_at)
    VALUES (${slug}, ${condition ?? null}, ${note_es ?? null}, ${note_en ?? null}, ${override_until ?? null}, NOW())
    ON CONFLICT (slug) DO UPDATE SET
      condition = EXCLUDED.condition, note_es = EXCLUDED.note_es,
      note_en = EXCLUDED.note_en, override_until = EXCLUDED.override_until,
      updated_at = NOW()
  `
  return NextResponse.json({ ok: true })
}
