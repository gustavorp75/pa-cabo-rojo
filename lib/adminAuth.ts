import { NextRequest } from 'next/server'
import { getDb } from '@/lib/db'

export async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get('x-admin-password')
  if (!auth) return false
  try {
    const db = getDb()
    const [row] = await db`SELECT value FROM site_settings WHERE key = 'admin_password'`
    return row?.value === auth
  } catch {
    // fallback to env var if DB not ready
    return auth === process.env.ADMIN_PASSWORD
  }
}
