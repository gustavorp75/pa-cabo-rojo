import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const rows = await db`SELECT key, value FROM site_settings WHERE key != 'admin_password'`
  const settings: Record<string, string> = {}
  rows.forEach((r: any) => { settings[r.key] = r.value })
  return NextResponse.json(settings)
}

export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = getDb()
  for (const [key, value] of Object.entries(body)) {
    if (key === 'admin_password') continue // never update password via this route
    await db`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (${key}, ${value as string}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `
  }
  return NextResponse.json({ ok: true })
}
