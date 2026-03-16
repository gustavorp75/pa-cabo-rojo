'use client'
import { useState, useEffect, useCallback } from 'react'
import { beaches as beachData } from '@/lib/data'
import { mapPins } from '@/lib/data'

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const
const DAY_LABELS: Record<string, string> = {
  monday:'Mon', tuesday:'Tue', wednesday:'Wed',
  thursday:'Thu', friday:'Fri', saturday:'Sat', sunday:'Sun'
}

const s: Record<string, React.CSSProperties> = {
  page:    { minHeight: '100vh', background: '#0f1a14', color: '#e8e0d0', fontFamily: "'Barlow', sans-serif", padding: '0 0 80px' },
  header:  { background: '#0d2d3f', borderBottom: '3px solid #1a7a6e', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title:   { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em', color: '#fff' },
  tab:     { padding: '10px 16px', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.5)', borderBottom: '3px solid transparent', transition: 'all 0.15s' },
  tabActive: { color: '#fff', borderBottomColor: '#e05a3a' },
  card:    { background: '#1a2a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: 16, marginBottom: 12 },
  label:   { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a9a7a', display: 'block', marginBottom: 4 },
  input:   { width: '100%', padding: '8px 12px', background: '#0f1a14', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: '#e8e0d0', fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const },
  select:  { width: '100%', padding: '8px 12px', background: '#0f1a14', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: '#e8e0d0', fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const },
  btn:     { padding: '9px 18px', background: '#1a7a6e', color: '#fff', border: 'none', borderRadius: 4, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' },
  btnDanger: { padding: '9px 18px', background: '#7a1a1a', color: '#fff', border: 'none', borderRadius: 4, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' },
  btnGold: { padding: '9px 18px', background: '#c9943a', color: '#0f1a14', border: 'none', borderRadius: 4, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' },
  saved:   { color: '#2ba99a', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' },
  section: { padding: '20px' },
  h2:      { fontFamily: "'Libre Baskerville', serif", fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 14 },
  row:     { display: 'flex', gap: 10, marginBottom: 10 },
  col:     { flex: 1 },
}

const badge = (color: string): React.CSSProperties => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 3, fontSize: '0.65rem', fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', background: color + '25', color })

type Tab = 'restaurants' | 'beaches' | 'events' | 'ticker' | 'listings' | 'pins'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [tab, setTab] = useState<Tab>('restaurants')
  const [saved, setSaved] = useState('')
  const [password, setPassword] = useState('')

  // Data state
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [beachOverrides, setBeachOverrides] = useState<Record<string, any>>({})
  const [events, setEvents] = useState<any[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [pinOverrides, setPinOverrides] = useState<Record<string, boolean>>({})
  const [listings, setListings] = useState<any[]>([])

  // New event form
  const [newEvent, setNewEvent] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '7:00', ampm: 'pm',
    name_es: '', name_en: '',
    where_es: '', where_en: '',
    desc_es: '', desc_en: '',
    category: 'music', type: 'free',
    label_es: 'Gratis', label_en: 'Free',
    recurs: '', recurs_en: '',
  })

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    'x-admin-password': password,
  }), [password])

  const showSaved = (msg = 'Saved ✓') => {
    setSaved(msg)
    setTimeout(() => setSaved(''), 2500)
  }

  const login = async () => {
    const res = await fetch('/api/admin/settings', { headers: { 'x-admin-password': pw } })
    if (res.ok) {
      setPassword(pw)
      setAuthed(true)
      setPwError(false)
    } else {
      setPwError(true)
    }
  }

  const loadAll = useCallback(async () => {
    const h = { 'x-admin-password': password }
    const [rRes, bRes, eRes, sRes, pRes, lRes] = await Promise.all([
      fetch('/api/admin/restaurants', { headers: h }),
      fetch('/api/admin/beaches', { headers: h }),
      fetch('/api/admin/events', { headers: h }),
      fetch('/api/admin/settings', { headers: h }),
      fetch('/api/admin/pins', { headers: h }),
      fetch('/api/listings', { headers: { ...h, 'Content-Type': 'application/json' } }),
    ])
    const [r, b, e, st, p, l] = await Promise.all([rRes.json(), bRes.json(), eRes.json(), sRes.json(), pRes.json(), lRes.ok ? lRes.json() : []])
    setRestaurants(Array.isArray(r) ? r : [])
    const bMap: Record<string, any> = {}
    if (Array.isArray(b)) b.forEach((row: any) => { bMap[row.slug] = row })
    setBeachOverrides(bMap)
    setEvents(Array.isArray(e) ? e : [])
    setSettings(st || {})
    const pMap: Record<string, boolean> = {}
    if (Array.isArray(p)) p.forEach((row: any) => { pMap[row.pin_id] = row.visible })
    setPinOverrides(pMap)
    setListings(Array.isArray(l) ? l : [])
  }, [password])

  useEffect(() => { if (authed) loadAll() }, [authed, loadAll])

  // ── LOGIN ──
  if (!authed) return (
    <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 320, background: '#1a2a1a', borderRadius: 8, padding: 32, border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color: '#fff', textAlign: 'center', marginBottom: 4 }}>PA' CABO ROJO</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', color: '#7a9a7a', letterSpacing: '0.16em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 24 }}>Admin Panel</div>
        <label style={s.label}>Password</label>
        <input style={{ ...s.input, marginBottom: 10 }} type="password" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="Enter admin password" />
        {pwError && <div style={{ color: '#e05a3a', fontSize: '0.75rem', marginBottom: 8 }}>Incorrect password</div>}
        <button style={{ ...s.btn, width: '100%' }} onClick={login}>Login →</button>
      </div>
    </div>
  )

  const tabs: { key: Tab; label: string }[] = [
    { key: 'restaurants', label: '🍽️ Restaurants' },
    { key: 'beaches',     label: '🏖️ Beaches' },
    { key: 'events',      label: '🌙 Events' },
    { key: 'ticker',      label: '📡 Ticker' },
    { key: 'pins',        label: '📍 Map Pins' },
    { key: 'listings',    label: '⭐ Listings' },
  ]

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.title}>PA' CABO ROJO — Admin</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {saved && <span style={s.saved}>{saved}</span>}
          <button style={{ ...s.btn, background: '#3a1a1a', fontSize: '0.72rem', padding: '6px 12px' }}
            onClick={() => setAuthed(false)}>Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#0d2d3f', display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {tabs.map(t => (
          <button key={t.key} style={{ ...s.tab, ...(tab === t.key ? s.tabActive : {}) }}
            onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {/* ── RESTAURANTS ── */}
      {tab === 'restaurants' && (
        <div style={s.section}>
          <h2 style={s.h2}>Restaurant Hours & Status</h2>
          <p style={{ fontSize: '0.78rem', color: '#7a9a7a', marginBottom: 16, lineHeight: 1.6 }}>
            Set real hours and the site auto-calculates open/closed. Use status override to force open or closed regardless of hours.
          </p>

          {['el-bohio','shamar','galloways','pescadores','kioscos-combate','pizza-boqueron','cafe-boqueron'].map(slug => {
            const existing = restaurants.find(r => r.slug === slug)
            return (
              <RestaurantEditor key={slug} slug={slug} existing={existing}
                headers={headers()} onSaved={() => { showSaved(); loadAll() }} />
            )
          })}
        </div>
      )}

      {/* ── BEACHES ── */}
      {tab === 'beaches' && (
        <div style={s.section}>
          <h2 style={s.h2}>Beach Condition Overrides</h2>
          <p style={{ fontSize: '0.78rem', color: '#7a9a7a', marginBottom: 16, lineHeight: 1.6 }}>
            Leave blank to use automatic conditions from weather data. Set an override to manually control what visitors see — useful for closures, red flags, or special events.
          </p>
          {['playa-sucia','playa-buye','combate','balneario'].map(slug => {
            const beach = beachData.find((b: any) => b.slug === slug)
            const override = beachOverrides[slug]
            return (
              <BeachEditor key={slug} slug={slug} name={beach ? (beach as any).nameEs : slug}
                override={override} headers={headers()} onSaved={() => { showSaved(); loadAll() }} />
            )
          })}
        </div>
      )}

      {/* ── EVENTS ── */}
      {tab === 'events' && (
        <div style={s.section}>
          <h2 style={s.h2}>Tonight's Events</h2>
          <p style={{ fontSize: '0.78rem', color: '#7a9a7a', marginBottom: 16, lineHeight: 1.6 }}>
            Add real events from Boquerón. These show on the Tonight page and the homepage preview.
          </p>

          {/* Add new event */}
          <div style={{ ...s.card, borderColor: '#1a7a6e' }}>
            <div style={{ ...s.h2, fontSize: '0.9rem', marginBottom: 12 }}>+ Add New Event</div>
            <div style={s.row}>
              <div style={s.col}>
                <label style={s.label}>Date</label>
                <input style={s.input} type="date" value={newEvent.date} onChange={e => setNewEvent(p => ({...p, date: e.target.value}))} />
              </div>
              <div style={{ width: 80 }}>
                <label style={s.label}>Time</label>
                <input style={s.input} value={newEvent.time} onChange={e => setNewEvent(p => ({...p, time: e.target.value}))} placeholder="7:30" />
              </div>
              <div style={{ width: 70 }}>
                <label style={s.label}>AM/PM</label>
                <select style={s.select} value={newEvent.ampm} onChange={e => setNewEvent(p => ({...p, ampm: e.target.value}))}>
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                </select>
              </div>
            </div>
            <div style={s.row}>
              <div style={s.col}>
                <label style={s.label}>Name (Spanish)</label>
                <input style={s.input} value={newEvent.name_es} onChange={e => setNewEvent(p => ({...p, name_es: e.target.value}))} placeholder="Salsa en Vivo — Shamar Bar" />
              </div>
              <div style={s.col}>
                <label style={s.label}>Name (English)</label>
                <input style={s.input} value={newEvent.name_en} onChange={e => setNewEvent(p => ({...p, name_en: e.target.value}))} placeholder="Live Salsa — Shamar Bar" />
              </div>
            </div>
            <div style={s.row}>
              <div style={s.col}>
                <label style={s.label}>Location (ES)</label>
                <input style={s.input} value={newEvent.where_es} onChange={e => setNewEvent(p => ({...p, where_es: e.target.value}))} placeholder="Calle de Boquerón" />
              </div>
              <div style={s.col}>
                <label style={s.label}>Location (EN)</label>
                <input style={s.input} value={newEvent.where_en} onChange={e => setNewEvent(p => ({...p, where_en: e.target.value}))} placeholder="Calle de Boquerón" />
              </div>
            </div>
            <div style={s.row}>
              <div style={s.col}>
                <label style={s.label}>Description (ES)</label>
                <input style={s.input} value={newEvent.desc_es} onChange={e => setNewEvent(p => ({...p, desc_es: e.target.value}))} placeholder="Descripción del evento..." />
              </div>
              <div style={s.col}>
                <label style={s.label}>Description (EN)</label>
                <input style={s.input} value={newEvent.desc_en} onChange={e => setNewEvent(p => ({...p, desc_en: e.target.value}))} placeholder="Event description..." />
              </div>
            </div>
            <div style={s.row}>
              <div style={s.col}>
                <label style={s.label}>Category</label>
                <select style={s.select} value={newEvent.category} onChange={e => setNewEvent(p => ({...p, category: e.target.value}))}>
                  {['music','food','nature','nightlife','family','deal'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={s.col}>
                <label style={s.label}>Type</label>
                <select style={s.select} value={newEvent.type} onChange={e => setNewEvent(p => ({...p, type: e.target.value}))}>
                  <option value="free">Free</option>
                  <option value="featured">Featured</option>
                  <option value="sponsored">Sponsored</option>
                </select>
              </div>
              <div style={s.col}>
                <label style={s.label}>Recurs (ES)</label>
                <input style={s.input} value={newEvent.recurs} onChange={e => setNewEvent(p => ({...p, recurs: e.target.value}))} placeholder="Todos los sábados" />
              </div>
            </div>
            <button style={s.btn} onClick={async () => {
              if (!newEvent.name_es || !newEvent.name_en) return
              await fetch('/api/admin/events', { method: 'POST', headers: headers(), body: JSON.stringify(newEvent) })
              setNewEvent(p => ({ ...p, name_es: '', name_en: '', where_es: '', where_en: '', desc_es: '', desc_en: '' }))
              showSaved('Event added ✓')
              loadAll()
            }}>Add Event →</button>
          </div>

          {/* Existing events */}
          {events.length === 0 ? (
            <p style={{ color: '#7a9a7a', fontSize: '0.8rem' }}>No upcoming events. Add one above.</p>
          ) : events.map((ev: any) => (
            <div key={ev.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: 2 }}>{ev.name_es}</div>
                  <div style={{ fontSize: '0.72rem', color: '#7a9a7a' }}>{ev.date} · {ev.time}{ev.ampm} · {ev.where_es}</div>
                  <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                    <span style={badge('#1a7a6e')}>{ev.category}</span>
                    <span style={badge(ev.type === 'featured' ? '#c9943a' : '#2ba99a')}>{ev.type}</span>
                    {ev.recurs && <span style={badge('#7c3aed')}>{ev.recurs}</span>}
                  </div>
                </div>
                <button style={s.btnDanger} onClick={async () => {
                  await fetch('/api/admin/events', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id: ev.id }) })
                  showSaved('Deleted ✓')
                  loadAll()
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TICKER ── */}
      {tab === 'ticker' && (
        <div style={s.section}>
          <h2 style={s.h2}>Weather Ticker Custom Message</h2>
          <p style={{ fontSize: '0.78rem', color: '#7a9a7a', marginBottom: 16, lineHeight: 1.6 }}>
            Add a custom message to the scrolling ticker. Leave blank to show only live weather data. Great for special announcements, road closures, or event promotions.
          </p>
          <div style={s.card}>
            <div style={s.row}>
              <div style={s.col}>
                <label style={s.label}>Custom message (Spanish)</label>
                <input style={s.input} value={settings.ticker_custom_es || ''} onChange={e => setSettings(p => ({...p, ticker_custom_es: e.target.value}))}
                  placeholder="🎉 Festival este fin de semana en el pueblo..." />
              </div>
            </div>
            <div style={s.row}>
              <div style={s.col}>
                <label style={s.label}>Custom message (English)</label>
                <input style={s.input} value={settings.ticker_custom_en || ''} onChange={e => setSettings(p => ({...p, ticker_custom_en: e.target.value}))}
                  placeholder="🎉 Festival this weekend in the village..." />
              </div>
            </div>
            <button style={s.btn} onClick={async () => {
              await fetch('/api/admin/settings', { method: 'POST', headers: headers(), body: JSON.stringify({ ticker_custom_es: settings.ticker_custom_es || '', ticker_custom_en: settings.ticker_custom_en || '' }) })
              showSaved()
            }}>Save Ticker Message</button>
          </div>
        </div>
      )}

      {/* ── MAP PINS ── */}
      {tab === 'pins' && (
        <div style={s.section}>
          <h2 style={s.h2}>Map Pin Visibility</h2>
          <p style={{ fontSize: '0.78rem', color: '#7a9a7a', marginBottom: 16, lineHeight: 1.6 }}>
            Toggle individual pins on or off. Useful for temporarily hiding a closed business or adding seasonal locations.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {mapPins.map((pin: any) => {
              const visible = pinOverrides[pin.id] !== false
              return (
                <div key={pin.id} style={{ ...s.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: visible ? '#fff' : '#7a9a7a' }}>{pin.nameEs}</div>
                    <div style={{ fontSize: '0.65rem', color: '#7a9a7a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{pin.type}</div>
                  </div>
                  <button
                    style={{ padding: '5px 12px', borderRadius: 4, border: 'none', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: visible ? '#1a7a6e' : '#3a1a1a', color: '#fff' }}
                    onClick={async () => {
                      const newVisible = !visible
                      setPinOverrides(p => ({ ...p, [pin.id]: newVisible }))
                      await fetch('/api/admin/pins', { method: 'POST', headers: headers(), body: JSON.stringify({ pin_id: pin.id, visible: newVisible }) })
                      showSaved()
                    }}>
                    {visible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── LISTINGS ── */}
      {tab === 'listings' && (
        <div style={s.section}>
          <h2 style={s.h2}>Business Listings</h2>
          <p style={{ fontSize: '0.78rem', color: '#7a9a7a', marginBottom: 16, lineHeight: 1.6 }}>
            All submitted business listings. Activate free listings or manage featured subscriptions.
          </p>
          {listings.length === 0 ? (
            <p style={{ color: '#7a9a7a', fontSize: '0.8rem' }}>No listings yet.</p>
          ) : listings.map((l: any) => (
            <div key={l.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: 4 }}>{l.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#7a9a7a', marginBottom: 6 }}>{l.category} · {l.email} · {l.address}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={badge(l.plan === 'featured' ? '#c9943a' : '#2ba99a')}>{l.plan}</span>
                    <span style={badge(l.status === 'active' ? '#16a34a' : l.status === 'pending' ? '#c9943a' : '#e05a3a')}>{l.status}</span>
                    {l.stripe_paid && <span style={badge('#7c3aed')}>Paid</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {l.status !== 'active' && (
                    <button style={{ ...s.btn, fontSize: '0.7rem', padding: '6px 12px' }}
                      onClick={async () => {
                        await fetch(`/api/listings/${l.id}/activate`, { method: 'POST', headers: headers() })
                        showSaved('Activated ✓')
                        loadAll()
                      }}>Activate</button>
                  )}
                  <button style={{ ...s.btnDanger, fontSize: '0.7rem', padding: '6px 12px' }}
                    onClick={async () => {
                      await fetch(`/api/listings/${l.id}/reject`, { method: 'POST', headers: headers() })
                      showSaved('Rejected ✓')
                      loadAll()
                    }}>Reject</button>
                </div>
              </div>
              {l.description && <p style={{ fontSize: '0.76rem', color: '#9a8a7a', marginTop: 8, lineHeight: 1.5 }}>{l.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── RESTAURANT EDITOR COMPONENT ──────────────────────────
function RestaurantEditor({ slug, existing, headers, onSaved }: { slug: string; existing: any; headers: any; onSaved: () => void }) {
  const defaultHours = () => Object.fromEntries(
    ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map(d => [d, { open: '11:00', close: '22:00', closed: false }])
  )
  const [data, setData] = useState({
    name: existing?.name || slug.replace(/-/g, ' '),
    hours: existing?.hours || defaultHours(),
    status_override: existing?.status_override || '',
    special_offer: existing?.special_offer || '',
    stars: existing?.stars || '',
    sponsored: existing?.sponsored || false,
    featured: existing?.featured || false,
    active: existing?.active !== false,
  })
  const [open, setOpen] = useState(false)

  const save = async () => {
    await fetch('/api/admin/restaurants', {
      method: 'POST', headers,
      body: JSON.stringify({ ...data, slug, category: 'mariscos', price: '$$', address: 'Boquerón, PR' })
    })
    onSaved()
  }

  const statusColor = existing?.status_override === 'open' ? '#16a34a' : existing?.status_override === 'closed' ? '#e05a3a' : '#c9943a'
  const statusLabel = existing?.status_override || 'auto'

  return (
    <div style={{ background: '#1a2a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, marginBottom: 8, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}>
        <div>
          <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{data.name || slug}</span>
          <span style={{ marginLeft: 10, fontSize: '0.65rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 3, background: statusColor + '25', color: statusColor }}>{statusLabel}</span>
        </div>
        <span style={{ color: '#7a9a7a', fontSize: '0.8rem' }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a9a7a', display: 'block', marginBottom: 4 }}>Display Name</label>
              <input style={{ width: '100%', padding: '8px 12px', background: '#0f1a14', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: '#e8e0d0', fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const }}
                value={data.name} onChange={e => setData(p => ({...p, name: e.target.value}))} />
            </div>
            <div style={{ width: 160 }}>
              <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a9a7a', display: 'block', marginBottom: 4 }}>Status Override</label>
              <select style={{ width: '100%', padding: '8px 12px', background: '#0f1a14', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: '#e8e0d0', fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const }}
                value={data.status_override} onChange={e => setData(p => ({...p, status_override: e.target.value}))}>
                <option value="">Auto (use hours)</option>
                <option value="open">Force Open</option>
                <option value="closed">Force Closed</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a9a7a', display: 'block', marginBottom: 4 }}>Special Offer</label>
            <input style={{ width: '100%', padding: '8px 12px', background: '#0f1a14', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: '#e8e0d0', fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const }}
              value={data.special_offer} onChange={e => setData(p => ({...p, special_offer: e.target.value}))}
              placeholder="Happy hour 5-8pm · $4 Medallas" />
          </div>

          {/* Hours grid */}
          <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a9a7a', display: 'block', marginBottom: 6 }}>Hours</label>
          <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            {(['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const).map((day, i) => {
              const h = data.hours[day] || { open: '11:00', close: '22:00', closed: false }
              return (
                <div key={day} style={{ display: 'grid', gridTemplateColumns: '76px 1fr 1fr auto', gap: 6, alignItems: 'center', padding: '6px 10px', borderBottom: i < 6 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: h.closed ? 'rgba(0,0,0,0.2)' : 'transparent' }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.68rem', fontWeight: 700, color: h.closed ? '#4a6a4a' : '#e8e0d0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{DAY_LABELS[day]}</span>
                  <input style={{ padding: '5px 8px', background: '#0f1a14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, color: h.closed ? '#4a6a4a' : '#e8e0d0', fontFamily: "'Barlow', sans-serif", fontSize: '0.76rem', opacity: h.closed ? 0.5 : 1 }}
                    value={h.open} disabled={h.closed} onChange={e => setData(p => ({ ...p, hours: { ...p.hours, [day]: { ...h, open: e.target.value } } }))} />
                  <input style={{ padding: '5px 8px', background: '#0f1a14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, color: h.closed ? '#4a6a4a' : '#e8e0d0', fontFamily: "'Barlow', sans-serif", fontSize: '0.76rem', opacity: h.closed ? 0.5 : 1 }}
                    value={h.close} disabled={h.closed} onChange={e => setData(p => ({ ...p, hours: { ...p.hours, [day]: { ...h, close: e.target.value } } }))} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <input type="checkbox" checked={h.closed} onChange={e => setData(p => ({ ...p, hours: { ...p.hours, [day]: { ...h, closed: e.target.checked } } }))} />
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.58rem', color: '#7a9a7a', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Closed</span>
                  </label>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center' }}>
            <button style={{ padding: '9px 18px', background: '#1a7a6e', color: '#fff', border: 'none', borderRadius: 4, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
              onClick={save}>Save →</button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.75rem', color: '#7a9a7a' }}>
              <input type="checkbox" checked={data.featured} onChange={e => setData(p => ({...p, featured: e.target.checked}))} />
              Featured
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.75rem', color: '#7a9a7a' }}>
              <input type="checkbox" checked={data.sponsored} onChange={e => setData(p => ({...p, sponsored: e.target.checked}))} />
              Sponsored
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

// ── BEACH EDITOR COMPONENT ────────────────────────────────
function BeachEditor({ slug, name, override, headers, onSaved }: { slug: string; name: string; override: any; headers: any; onSaved: () => void }) {
  const [condition, setCondition] = useState(override?.condition || '')
  const [noteEs, setNoteEs] = useState(override?.note_es || '')
  const [noteEn, setNoteEn] = useState(override?.note_en || '')
  const [until, setUntil] = useState(override?.override_until?.split('T')[0] || '')

  const condColors: Record<string, string> = { great: '#16a34a', good: '#c9943a', busy: '#e05a3a', rough: '#dc2626', '': '#7a9a7a' }

  return (
    <div style={{ background: '#1a2a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: 16, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{name}</span>
        <span style={{ fontSize: '0.65rem', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 3, background: condColors[condition] + '25', color: condColors[condition] }}>
          {condition || 'auto'}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div>
          <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a9a7a', display: 'block', marginBottom: 4 }}>Override</label>
          <select style={{ width: '100%', padding: '8px 12px', background: '#0f1a14', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: '#e8e0d0', fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const }}
            value={condition} onChange={e => setCondition(e.target.value)}>
            <option value="">Auto from weather</option>
            <option value="great">Great</option>
            <option value="good">Good</option>
            <option value="busy">Busy</option>
            <option value="rough">Rough / Closed</option>
          </select>
        </div>
        <div>
          <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a9a7a', display: 'block', marginBottom: 4 }}>Note (ES)</label>
          <input style={{ width: '100%', padding: '8px 12px', background: '#0f1a14', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: '#e8e0d0', fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const }}
            value={noteEs} onChange={e => setNoteEs(e.target.value)} placeholder="Bandera roja hoy" />
        </div>
        <div>
          <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a9a7a', display: 'block', marginBottom: 4 }}>Override Until</label>
          <input type="date" style={{ width: '100%', padding: '8px 12px', background: '#0f1a14', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, color: '#e8e0d0', fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const }}
            value={until} onChange={e => setUntil(e.target.value)} />
        </div>
      </div>
      <button style={{ padding: '9px 18px', background: '#1a7a6e', color: '#fff', border: 'none', borderRadius: 4, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
        onClick={async () => {
          await fetch('/api/admin/beaches', { method: 'POST', headers, body: JSON.stringify({ slug, condition: condition || null, note_es: noteEs || null, note_en: noteEn || null, override_until: until || null }) })
          onSaved()
        }}>Save →</button>
      {condition && (
        <button style={{ marginLeft: 10, padding: '9px 18px', background: 'transparent', color: '#7a9a7a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
          onClick={async () => {
            setCondition('')
            setNoteEs('')
            setNoteEn('')
            setUntil('')
            await fetch('/api/admin/beaches', { method: 'POST', headers, body: JSON.stringify({ slug, condition: null, note_es: null, note_en: null, override_until: null }) })
            onSaved()
          }}>Clear Override</button>
      )}
    </div>
  )
}
