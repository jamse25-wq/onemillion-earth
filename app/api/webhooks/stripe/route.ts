import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Approximate lat/lng centres for common countries
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  GB: { lat: 52.5, lng: -1.5 },
  US: { lat: 37.1, lng: -95.7 },
  CA: { lat: 56.1, lng: -106.3 },
  AU: { lat: -25.3, lng: 133.8 },
  DE: { lat: 51.2, lng: 10.5 },
  FR: { lat: 46.2, lng: 2.2 },
  NL: { lat: 52.1, lng: 5.3 },
  SE: { lat: 60.1, lng: 18.6 },
  NO: { lat: 60.5, lng: 8.5 },
  DK: { lat: 56.3, lng: 9.5 },
  CH: { lat: 46.8, lng: 8.2 },
  IE: { lat: 53.4, lng: -8.2 },
  IT: { lat: 41.9, lng: 12.6 },
  ES: { lat: 40.5, lng: -3.7 },
  PT: { lat: 39.4, lng: -8.2 },
  BE: { lat: 50.5, lng: 4.5 },
  AT: { lat: 47.5, lng: 14.6 },
  NZ: { lat: -40.9, lng: 174.9 },
  SG: { lat: 1.4, lng: 103.8 },
  JP: { lat: 36.2, lng: 138.3 },
  IN: { lat: 20.6, lng: 79.1 },
  BR: { lat: -14.2, lng: -51.9 },
  ZA: { lat: -30.6, lng: 22.9 },
  KE: { lat: -0.0, lng: 37.9 },
  NG: { lat: 9.1, lng: 8.7 },
}

// Add some jitter so markers don't all stack exactly at the country centre
function jitter(value: number, range = 2): number {
  return value + (Math.random() - 0.5) * range
}

function getCoordsForCountry(countryCode: string | null): { lat: number; lng: number } {
  if (countryCode && COUNTRY_COORDS[countryCode]) {
    const base = COUNTRY_COORDS[countryCode]
    return { lat: jitter(base.lat), lng: jitter(base.lng) }
  }
  // fallback: random-ish position
  return { lat: jitter(30, 60), lng: jitter(0, 160) }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    // Acknowledge but ignore other event types
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const meta = session.metadata

  if (!meta) {
    console.error('No metadata on session:', session.id)
    return NextResponse.json({ error: 'No metadata' }, { status: 400 })
  }

  // Determine lat/lng from billing country on the session (may be null)
  const sessionAny = session as unknown as { customer_details?: { address?: { country?: string } } }
  const countryCode = sessionAny?.customer_details?.address?.country ?? null
  const { lat, lng } = getCoordsForCountry(countryCode)

  const { error } = await supabase.from('purchases').insert({
    buyer_name: meta.buyerName,
    buyer_email: meta.buyerEmail,
    is_anonymous: meta.isAnonymous === 'true',
    organisation: meta.organisation || null,
    project_slug: meta.projectSlug,
    tonnes: parseFloat(meta.tonnes),
    amount_gbp: parseFloat(meta.totalGbp),
    carbon_cost_gbp: parseFloat(meta.carbonCostGbp),
    platform_fee_gbp: parseFloat(meta.platformFeeGbp),
    stripe_payment_id: session.payment_intent as string,
    certificate_id: meta.certificateId,
    lat,
    lng,
    country: countryCode,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
