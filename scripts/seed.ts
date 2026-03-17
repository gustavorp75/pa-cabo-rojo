// Run with: npx tsx scripts/seed.ts
// Seeds the database with data from data.ts so admin panel is pre-populated

import { neon } from '@neondatabase/serverless'
import { fullRestaurants, mapPins, beaches } from '../lib/data'

const db = neon(process.env.DATABASE_URL!)

async function seed() {
  console.log('🌱 Seeding database...\n')

  // ── RESTAURANTS ──────────────────────────────────────────
  console.log('Seeding restaurants...')
  for (const r of fullRestaurants) {
    const hours = (r as any).hours ?? null
    await db`
      INSERT INTO restaurants (
        slug, name, category, price, description, phone, website, address,
        hours, status_override, stars, sponsored, featured, active, updated_at
      ) VALUES (
        ${r.id},
        ${r.name},
        ${r.category},
        ${r.price},
        ${(r as any).taglineEs ?? null},
        ${(r as any).phone ?? null},
        ${(r as any).website ?? null},
        ${(r as any).locationEs ?? 'Boquerón, Cabo Rojo, PR'},
        ${hours ? JSON.stringify(hours) : null},
        ${null},
        ${r.stars ?? null},
        ${(r as any).sponsored ?? false},
        ${(r as any).featured ?? false},
        ${true},
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        name        = EXCLUDED.name,
        category    = EXCLUDED.category,
        price       = EXCLUDED.price,
        description = EXCLUDED.description,
        address     = EXCLUDED.address,
        hours       = EXCLUDED.hours,
        stars       = EXCLUDED.stars,
        active      = EXCLUDED.active,
        updated_at  = NOW()
    `
    console.log(`  ✓ ${r.name}`)
  }

  // ── BEACH OVERRIDES (empty — auto from weather) ──────────
  console.log('\nSeeding beach overrides (empty = auto)...')
  const beachSlugs = ['playa-sucia', 'playa-buye', 'combate', 'balneario']
  for (const slug of beachSlugs) {
    await db`
      INSERT INTO beach_overrides (slug, condition, note_es, note_en, updated_at)
      VALUES (${slug}, ${null}, ${null}, ${null}, NOW())
      ON CONFLICT (slug) DO NOTHING
    `
    console.log(`  ✓ ${slug}`)
  }

  // ── MAP PIN VISIBILITY (all visible by default) ──────────
  console.log('\nSeeding map pin visibility...')
  for (const pin of mapPins) {
    await db`
      INSERT INTO map_pin_overrides (pin_id, visible, updated_at)
      VALUES (${pin.id}, ${true}, NOW())
      ON CONFLICT (pin_id) DO NOTHING
    `
    console.log(`  ✓ ${pin.id}`)
  }

  // ── SITE SETTINGS ─────────────────────────────────────────
  console.log('\nSeeding site settings...')
  const settings = [
    ['ticker_custom_es', ''],
    ['ticker_custom_en', ''],
    ['admin_password',   'pacaborojo2024'],
  ]
  for (const [key, value] of settings) {
    await db`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (${key}, ${value}, NOW())
      ON CONFLICT (key) DO NOTHING
    `
    console.log(`  ✓ ${key}`)
  }

  // ── EVENT IMPACT DEFAULTS ─────────────────────────────────
  console.log('\nSeeding event impact defaults...')
  const zones = ['boqueron-poblado','balneario','playa-buye','combate','playa-sucia','faro-morrillos','salinas']
  for (const zoneId of zones) {
    await db`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (${`event_impact_${zoneId}`}, ${'none'}, NOW())
      ON CONFLICT (key) DO NOTHING
    `
    console.log(`  ✓ event_impact_${zoneId}`)
  }

  console.log('\n✅ Database seeded successfully!')
  console.log('👉 Visit /admin to manage your data')
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
