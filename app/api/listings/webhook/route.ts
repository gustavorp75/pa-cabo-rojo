import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getDb } from '@/lib/db'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const db = getDb()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const listingId = session.metadata?.listingId
    const businessName = session.metadata?.businessName

    if (listingId) {
      // Activate the listing
      await db`
        UPDATE business_listings
        SET
          status = 'active',
          stripe_paid = TRUE,
          stripe_payment_intent = ${session.payment_intent as string ?? null},
          updated_at = NOW()
        WHERE id = ${parseInt(listingId)}
      `

      // Notify admin
      await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: process.env.ADMIN_EMAIL!,
        subject: `✅ Featured listing paid & active: ${businessName}`,
        html: `<p>Listing <strong>${businessName}</strong> (ID: ${listingId}) is now active. Payment confirmed via Stripe.</p>`,
      }).catch(console.error)

      // Notify business owner
      if (session.customer_email) {
        await resend.emails.send({
          from: process.env.RESEND_FROM!,
          to: session.customer_email,
          subject: `Your featured listing is live — ${businessName}`,
          html: `
            <h2>Your listing is live! 🎉</h2>
            <p><strong>${businessName}</strong> is now featured on Pa' Cabo Rojo.</p>
            <p>Visitors searching for places to eat, drink, and explore in Boquerón will see your listing at the top.</p>
            <p>Your subscription renews monthly. To make changes to your listing reply to this email.</p>
            <p>— Pa' Cabo Rojo team</p>
          `,
        }).catch(console.error)
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    // Downgrade to free if subscription cancelled
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    await db`
      UPDATE business_listings
      SET plan = 'free', stripe_paid = FALSE, updated_at = NOW()
      WHERE stripe_session_id IN (
        SELECT id FROM stripe_sessions WHERE customer_id = ${customerId}
      )
    `.catch(console.error) // best effort
  }

  return NextResponse.json({ received: true })
}
