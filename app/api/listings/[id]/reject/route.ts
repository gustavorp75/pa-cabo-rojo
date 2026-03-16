import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyAdmin } from '@/lib/adminAuth'
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const db = getDb()
  await db`UPDATE business_listings SET status = 'rejected', updated_at = NOW() WHERE id = ${parseInt(id)}`
  return NextResponse.json({ ok: true })
}
