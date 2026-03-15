import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getDb } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export async function POST(req: NextRequest) {
  try {
    const { listingId, businessName, email } = await req.json()

    if (!listingId || !email) {
      return NextResponse.json({ error: 'Missing listingId or email' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Pa' Cabo Rojo — Featured Listing`,
              description: `Featured placement for ${businessName}. Top of category, photo, Tonight's feed.`,
              images: [],
            },
            unit_amount: 4900, // $49.00
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      metadata: {
        listingId: String(listingId),
        businessName,
      },
      success_url: `${appUrl}/listings/success?session_id={CHECKOUT_SESSION_ID}&listing_id=${listingId}`,
      cancel_url: `${appUrl}/listings/new?cancelled=true`,
    })

    // Save session ID to listing
    const db = getDb()
    await db`
      UPDATE business_listings
      SET stripe_session_id = ${session.id}, updated_at = NOW()
      WHERE id = ${listingId}
    `

    return NextResponse.json({ url: session.url })

  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
