import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const rows = await db`SELECT * FROM restaurants ORDER BY name`
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = getDb()
  const { slug, name, category, price, description, special_offer, phone, website, address, hours, status_override, stars, sponsored, featured, active } = body

  await db`
    INSERT INTO restaurants (slug, name, category, price, description, special_offer, phone, website, address, hours, status_override, stars, sponsored, featured, active, updated_at)
    VALUES (${slug}, ${name}, ${category}, ${price}, ${description ?? null}, ${special_offer ?? null}, ${phone ?? null}, ${website ?? null}, ${address ?? null}, ${hours ? JSON.stringify(hours) : null}, ${status_override ?? null}, ${stars ?? null}, ${sponsored ?? false}, ${featured ?? false}, ${active ?? true}, NOW())
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name, category = EXCLUDED.category, price = EXCLUDED.price,
      description = EXCLUDED.description, special_offer = EXCLUDED.special_offer,
      phone = EXCLUDED.phone, website = EXCLUDED.website, address = EXCLUDED.address,
      hours = EXCLUDED.hours, status_override = EXCLUDED.status_override,
      stars = EXCLUDED.stars, sponsored = EXCLUDED.sponsored,
      featured = EXCLUDED.featured, active = EXCLUDED.active, updated_at = NOW()
  `
  return NextResponse.json({ ok: true })
}
