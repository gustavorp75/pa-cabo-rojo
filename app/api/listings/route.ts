import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: NextRequest) {
  const auth = req.headers.get('x-admin-password')
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  const rows = await db`SELECT * FROM business_listings ORDER BY created_at DESC`
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      plan, name, category, description, specialOffer,
      phone, website, email, address, neighborhood,
      hours, photoUrl,
    } = body

    // Validate required fields
    if (!name || !category || !email || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getDb()

    // Insert listing
    const [listing] = await db`
      INSERT INTO business_listings (
        plan, status, name, category, description, special_offer,
        phone, website, email, address, neighborhood, hours, photo_url
      ) VALUES (
        ${plan ?? 'free'},
        ${plan === 'featured' ? 'pending_payment' : 'pending'},
        ${name}, ${category}, ${description ?? null}, ${specialOffer ?? null},
        ${phone ?? null}, ${website ?? null}, ${email},
        ${address}, ${neighborhood ?? null},
        ${hours ? JSON.stringify(hours) : null},
        ${photoUrl ?? null}
      )
      RETURNING id, plan, name, email
    `

    // Send admin notification email
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: process.env.ADMIN_EMAIL!,
      subject: `New ${listing.plan} listing: ${listing.name}`,
      html: `
        <h2>New Business Listing Submission</h2>
        <p><strong>Plan:</strong> ${listing.plan}</p>
        <p><strong>Business:</strong> ${name}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Contact:</strong> ${email} ${phone ? `· ${phone}` : ''}</p>
        <p><strong>Website:</strong> ${website ?? 'N/A'}</p>
        <p><strong>Description:</strong> ${description ?? 'N/A'}</p>
        ${specialOffer ? `<p><strong>Special Offer:</strong> ${specialOffer}</p>` : ''}
        <p><strong>ID:</strong> #${listing.id}</p>
      `,
    }).catch(console.error) // don't fail the request if email fails

    // Send confirmation to submitter
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: `We received your listing — ${name}`,
      html: `
        <h2>¡Gracias! / Thank you!</h2>
        <p>We received your listing for <strong>${name}</strong>.</p>
        ${plan === 'free'
          ? '<p>We\'ll review it and activate it within 24 hours. You\'ll hear from us soon!</p>'
          : '<p>Complete your payment to activate your featured listing.</p>'
        }
        <p>— Pa\' Cabo Rojo team</p>
      `,
    }).catch(console.error)

    return NextResponse.json({ id: listing.id, plan: listing.plan })

  } catch (err) {
    console.error('Listing POST error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
