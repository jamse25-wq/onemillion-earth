import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const meta = session.metadata

    if (!meta) {
      return NextResponse.json({ error: 'No session metadata' }, { status: 404 })
    }

    return NextResponse.json({
      buyerName: meta.buyerName,
      organisation: meta.organisation || null,
      isAnonymous: meta.isAnonymous === 'true',
      tonnes: parseFloat(meta.tonnes),
      projectName: meta.projectName,
      projectSlug: meta.projectSlug,
      creditType: meta.creditType,
      registry: meta.registry,
      certificateId: meta.certificateId,
      carbonCostGbp: parseFloat(meta.carbonCostGbp),
      platformFeeGbp: parseFloat(meta.platformFeeGbp),
      totalGbp: parseFloat(meta.totalGbp),
    })
  } catch (err) {
    console.error('Error retrieving session:', err)
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 })
  }
}
