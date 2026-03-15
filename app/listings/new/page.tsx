'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLang } from '@/lib/LangContext'
import TopBar from '@/components/TopBar'
import BottomNav from '@/components/BottomNav'
import { foodCategoryMeta } from '@/lib/data'

type Plan = 'free' | 'featured'
type Step = 1 | 2 | 3 | 4

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const
const DAYS_ES: Record<string,string> = {
  monday:'Lunes',tuesday:'Martes',wednesday:'Miércoles',
  thursday:'Jueves',friday:'Viernes',saturday:'Sábado',sunday:'Domingo',
}

interface HourEntry { open: string; close: string; closed: boolean }
type Hours = Record<string, HourEntry>

const defaultHours = (): Hours =>
  Object.fromEntries(DAYS.map(d => [d, { open: '9:00 AM', close: '9:00 PM', closed: false }]))

const inp: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1px solid var(--rule)', borderRadius: 3,
  background: 'var(--warm-white)', color: 'var(--ink)',
  fontFamily: "'Barlow', sans-serif", fontSize: '0.88rem', outline: 'none',
  boxSizing: 'border-box',
}

const lbl: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
  textTransform: 'uppercase', color: 'var(--muted)',
  display: 'block', marginBottom: 6,
}

const btnPrimary: React.CSSProperties = {
  flex: 2, padding: '13px', background: 'var(--ocean)', color: '#fff',
  border: 'none', borderRadius: 3, fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.12em',
  textTransform: 'uppercase', cursor: 'pointer',
}

const btnBack: React.CSSProperties = {
  flex: 1, padding: '13px', background: 'transparent', color: 'var(--muted)',
  border: '1px solid var(--rule)', borderRadius: 3,
  fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.85rem',
  fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
}

export default function NewListingPage() {
  const { lang } = useLang()
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // All form state at top level — never inside child components
  const [plan, setPlan] = useState<Plan>('free')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [specialOffer, setSpecialOffer] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [hours, setHours] = useState<Hours>(defaultHours())

  const setHour = (day: string, field: keyof HourEntry, value: any) =>
    setHours(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }))

  const progress = (step / 4) * 100

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, name, category, description, specialOffer, phone, website, email, address, neighborhood, hours }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed')

      if (plan === 'featured') {
        const checkoutRes = await fetch('/api/listings/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId: data.id, businessName: name, email }),
        })
        const checkoutData = await checkoutRes.json()
        if (!checkoutRes.ok) throw new Error(checkoutData.error ?? 'Checkout failed')
        window.location.href = checkoutData.url
        return
      }
      router.push(`/listings/success?listing_id=${data.id}&plan=free`)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <TopBar />

      {/* Header */}
      <div style={{ background: 'var(--warm-white)', borderBottom: '3px solid var(--ink)', padding: '16px 18px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", color: 'var(--coral)', fontSize: '1rem' }}>←</span>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--muted)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {lang === 'es' ? 'Volver' : 'Back'}
          </span>
        </Link>
        <h1 style={{ fontFamily: "'Libre Baskerville',serif", color: 'var(--ink)', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.1, marginBottom: 4 }}>
          {lang === 'es' ? 'Registra tu Negocio' : 'List Your Business'}
        </h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
          {lang === 'es' ? 'Llega a visitantes que deciden a dónde ir en Boquerón ahora mismo.' : 'Reach visitors deciding where to go in Boquerón right now.'}
        </p>
      </div>

      {/* Step indicator */}
      <div style={{ padding: '12px 18px', background: 'var(--warm-white)', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          {[1,2,3,4].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: s < step ? 'var(--teal)' : s === step ? 'var(--ocean)' : 'var(--rule)', color: s <= step ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue',sans-serif", fontSize: '0.85rem', border: s === step ? '2px solid var(--teal)' : 'none' }}>
                {s < step ? '✓' : s}
              </div>
              {s < 4 && <div style={{ width: 40, height: 2, background: s < step ? 'var(--teal)' : 'var(--rule)' }} />}
            </div>
          ))}
        </div>
        <div style={{ height: 3, background: 'var(--rule)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--teal)', transition: 'width 0.3s ease', borderRadius: 2 }} />
        </div>
      </div>

      {error && (
        <div style={{ margin: '12px 18px 0', background: 'rgba(224,90,58,0.1)', border: '1px solid rgba(224,90,58,0.3)', borderRadius: 3, padding: '10px 14px', fontSize: '0.78rem', color: 'var(--coral)' }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── STEP 1: PLAN ── */}
      {step === 1 && (
        <div style={{ padding: '20px 18px' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--teal)', letterSpacing: '0.16em', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
            {lang === 'es' ? 'Paso 1 de 4' : 'Step 1 of 4'}
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville',serif", color: 'var(--ink)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 20 }}>
            {lang === 'es' ? 'Elige tu plan' : 'Choose your plan'}
          </h2>

          {/* Free */}
          <div onClick={() => setPlan('free')} style={{ border: `2px solid ${plan === 'free' ? 'var(--teal)' : 'var(--rule)'}`, borderRadius: 4, padding: 16, marginBottom: 12, cursor: 'pointer', background: plan === 'free' ? 'rgba(26,122,110,0.05)' : 'var(--warm-white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, fontSize: '1rem' }}>{lang === 'es' ? 'Listado Básico' : 'Basic Listing'}</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.4rem', color: 'var(--teal)' }}>{lang === 'es' ? 'Gratis' : 'Free'}</div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${plan === 'free' ? 'var(--teal)' : 'var(--rule)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {plan === 'free' && <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--teal)' }} />}
              </div>
            </div>
            {(lang === 'es' ? ['Nombre, horario y categoría','Aparece en búsquedas y mapa','Revisión en 24 horas'] : ['Name, hours & category','Appears in search and map','24hr review']).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <span style={{ color: 'var(--teal)' }}>✓</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Featured */}
          <div onClick={() => setPlan('featured')} style={{ border: `2px solid ${plan === 'featured' ? 'var(--gold)' : 'var(--rule)'}`, borderRadius: 4, padding: 16, marginBottom: 20, cursor: 'pointer', background: plan === 'featured' ? 'rgba(201,148,58,0.06)' : 'var(--warm-white)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--gold)', color: 'var(--ink)', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px' }}>
              ⭐ {lang === 'es' ? 'Recomendado' : 'Recommended'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, paddingTop: 4 }}>
              <div>
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, fontSize: '1rem' }}>{lang === 'es' ? 'Listado Destacado' : 'Featured Listing'}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.6rem', color: 'var(--gold)' }}>$49</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{lang === 'es' ? '/mes' : '/month'}</span>
                </div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${plan === 'featured' ? 'var(--gold)' : 'var(--rule)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {plan === 'featured' && <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--gold)' }} />}
              </div>
            </div>
            {(lang === 'es'
              ? ['Todo lo del plan gratis','Primero en tu categoría','Foto y oferta especial','Incluido en Esta Noche','Badge "Destacado" en el mapa']
              : ['Everything in free plan','Top of your category','Photo and special offer','Included in Tonight feed','"Featured" badge on map']
            ).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <span style={{ color: 'var(--gold)' }}>✓</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{item}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setStep(2)} style={{ ...btnPrimary, flex: 'unset', width: '100%' }}>
            {lang === 'es' ? 'Continuar →' : 'Continue →'}
          </button>
        </div>
      )}

      {/* ── STEP 2: BUSINESS INFO ── */}
      {step === 2 && (
        <div style={{ padding: '20px 18px' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--teal)', letterSpacing: '0.16em', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
            {lang === 'es' ? 'Paso 2 de 4' : 'Step 2 of 4'}
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville',serif", color: 'var(--ink)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 20 }}>
            {lang === 'es' ? 'Info del negocio' : 'Business info'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={lbl}>{lang === 'es' ? 'Nombre del negocio *' : 'Business name *'}</label>
              <input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder={lang === 'es' ? 'Ej: El Bohío' : 'e.g. El Bohío'} />
            </div>
            <div>
              <label style={lbl}>{lang === 'es' ? 'Categoría *' : 'Category *'}</label>
              <select style={inp} value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">{lang === 'es' ? 'Selecciona una categoría' : 'Select a category'}</option>
                {Object.entries(foodCategoryMeta).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.icon} {lang === 'es' ? cat.es : cat.en}</option>
                ))}
                <option value="hotel">{lang === 'es' ? '🏨 Hotel / Hospedaje' : '🏨 Hotel / Lodging'}</option>
                <option value="tour">{lang === 'es' ? '🚤 Tours / Actividades' : '🚤 Tours / Activities'}</option>
                <option value="shop">{lang === 'es' ? '🛍️ Tienda' : '🛍️ Shop'}</option>
                <option value="other">{lang === 'es' ? '📍 Otro' : '📍 Other'}</option>
              </select>
            </div>
            <div>
              <label style={lbl}>{lang === 'es' ? 'Descripción' : 'Description'}</label>
              <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)}
                placeholder={lang === 'es' ? 'Describe tu negocio en 1-2 oraciones...' : 'Describe your business in 1-2 sentences...'} />
            </div>
            <div>
              <label style={lbl}>{lang === 'es' ? 'Oferta especial (opcional)' : 'Special offer (optional)'}</label>
              <input style={inp} value={specialOffer} onChange={e => setSpecialOffer(e.target.value)}
                placeholder={lang === 'es' ? 'Ej: Happy hour 5-8pm · Medallas $4' : 'e.g. Happy hour 5-8pm · $4 Medallas'} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button onClick={() => setStep(1)} style={btnBack}>← {lang === 'es' ? 'Atrás' : 'Back'}</button>
            <button onClick={() => { if (!name || !category) { setError(lang === 'es' ? 'Nombre y categoría son requeridos' : 'Name and category are required'); return; } setError(''); setStep(3) }} style={btnPrimary}>
              {lang === 'es' ? 'Continuar →' : 'Continue →'}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: CONTACT + HOURS ── */}
      {step === 3 && (
        <div style={{ padding: '20px 18px' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--teal)', letterSpacing: '0.16em', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
            {lang === 'es' ? 'Paso 3 de 4' : 'Step 3 of 4'}
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville',serif", color: 'var(--ink)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 20 }}>
            {lang === 'es' ? 'Contacto y horario' : 'Contact & hours'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={lbl}>{lang === 'es' ? 'Email de contacto *' : 'Contact email *'}</label>
              <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@turestaurante.com" />
            </div>
            <div>
              <label style={lbl}>{lang === 'es' ? 'Teléfono' : 'Phone'}</label>
              <input style={inp} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(787) 000-0000" />
            </div>
            <div>
              <label style={lbl}>{lang === 'es' ? 'Sitio web' : 'Website'}</label>
              <input style={inp} value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label style={lbl}>{lang === 'es' ? 'Dirección *' : 'Address *'}</label>
              <input style={inp} value={address} onChange={e => setAddress(e.target.value)} placeholder={lang === 'es' ? 'Ej: Calle José De Diego, Boquerón' : 'e.g. Calle José De Diego, Boquerón'} />
            </div>
            <div>
              <label style={lbl}>{lang === 'es' ? 'Horario' : 'Hours'}</label>
              <div style={{ border: '1px solid var(--rule)', borderRadius: 3, overflow: 'hidden' }}>
                {DAYS.map((day, i) => (
                  <div key={day} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr auto', gap: 6, alignItems: 'center', padding: '8px 10px', borderBottom: i < DAYS.length - 1 ? '1px solid var(--rule)' : 'none', background: hours[day].closed ? 'rgba(0,0,0,0.02)' : 'var(--warm-white)' }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.66rem', fontWeight: 700, color: hours[day].closed ? 'var(--muted)' : 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {lang === 'es' ? DAYS_ES[day] : day.charAt(0).toUpperCase() + day.slice(1)}
                    </span>
                    <input style={{ ...inp, padding: '6px 8px', fontSize: '0.76rem', opacity: hours[day].closed ? 0.4 : 1 }}
                      value={hours[day].open} onChange={e => setHour(day, 'open', e.target.value)} disabled={hours[day].closed} placeholder="9:00 AM" />
                    <input style={{ ...inp, padding: '6px 8px', fontSize: '0.76rem', opacity: hours[day].closed ? 0.4 : 1 }}
                      value={hours[day].close} onChange={e => setHour(day, 'close', e.target.value)} disabled={hours[day].closed} placeholder="9:00 PM" />
                    <label style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
                      <input type="checkbox" checked={hours[day].closed} onChange={e => setHour(day, 'closed', e.target.checked)} />
                      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.58rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                        {lang === 'es' ? 'Cerrado' : 'Closed'}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button onClick={() => setStep(2)} style={btnBack}>← {lang === 'es' ? 'Atrás' : 'Back'}</button>
            <button onClick={() => { if (!email || !address) { setError(lang === 'es' ? 'Email y dirección son requeridos' : 'Email and address are required'); return; } setError(''); setStep(4) }} style={btnPrimary}>
              {lang === 'es' ? 'Continuar →' : 'Continue →'}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: REVIEW ── */}
      {step === 4 && (
        <div style={{ padding: '20px 18px' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", color: 'var(--teal)', letterSpacing: '0.16em', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
            {lang === 'es' ? 'Paso 4 de 4' : 'Step 4 of 4'}
          </div>
          <h2 style={{ fontFamily: "'Libre Baskerville',serif", color: 'var(--ink)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 16 }}>
            {lang === 'es' ? 'Revisa y envía' : 'Review & submit'}
          </h2>

          <div style={{ background: 'var(--warm-white)', border: '1px solid var(--rule)', borderRadius: 4, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>{name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>{category} · {address}</div>
              </div>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 2, background: plan === 'featured' ? 'rgba(201,148,58,0.15)' : 'rgba(26,122,110,0.1)', color: plan === 'featured' ? 'var(--gold)' : 'var(--teal)' }}>
                {plan === 'featured' ? '⭐ Featured' : 'Free'}
              </span>
            </div>
            {[
              [lang === 'es' ? 'Email' : 'Email', email],
              [lang === 'es' ? 'Teléfono' : 'Phone', phone || '—'],
              [lang === 'es' ? 'Web' : 'Website', website || '—'],
              [lang === 'es' ? 'Oferta' : 'Special offer', specialOffer || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', minWidth: 70 }}>{label}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--ink)' }}>{value}</span>
              </div>
            ))}
          </div>

          {plan === 'featured' && (
            <div style={{ background: 'rgba(201,148,58,0.08)', border: '1px solid rgba(201,148,58,0.25)', borderRadius: 4, padding: '14px 16px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>{lang === 'es' ? 'Listado Destacado' : 'Featured Listing'}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>{lang === 'es' ? 'Suscripción mensual · Cancela cuando quieras' : 'Monthly subscription · Cancel anytime'}</div>
                </div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.5rem', color: 'var(--gold)' }}>
                  $49<span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: "'Barlow',sans-serif" }}>/mo</span>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: '0.7rem', color: 'var(--muted)' }}>
                🔒 {lang === 'es' ? 'Pago seguro vía Stripe.' : 'Secure payment via Stripe.'}
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(224,90,58,0.1)', border: '1px solid rgba(224,90,58,0.3)', borderRadius: 3, padding: '10px 14px', marginBottom: 14, fontSize: '0.78rem', color: 'var(--coral)' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStep(3)} style={btnBack}>← {lang === 'es' ? 'Atrás' : 'Back'}</button>
            <button onClick={handleSubmit} disabled={loading}
              style={{ ...btnPrimary, background: loading ? 'var(--muted)' : plan === 'featured' ? 'var(--gold)' : 'var(--teal)', color: plan === 'featured' ? 'var(--ink)' : '#fff', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading
                ? (lang === 'es' ? 'Enviando...' : 'Submitting...')
                : plan === 'featured'
                  ? (lang === 'es' ? '💳 Pagar $49/mes →' : '💳 Pay $49/mo →')
                  : (lang === 'es' ? '✓ Enviar Listado Gratis' : '✓ Submit Free Listing')}
            </button>
          </div>
        </div>
      )}

      <div className="h-24" />
      <BottomNav />
    </div>
  )
}
