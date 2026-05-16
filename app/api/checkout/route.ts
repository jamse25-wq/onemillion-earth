import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getProjectBySlug } from '@/lib/projects'
import { randomUUID } from 'crypto'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

const PLATFORM_FEE_RATE = 0.18

export async function POST(req: NextRequest) {
  try {
    const { projectSlug, tonnes, buyerName, buyerEmail, isAnonymous, organisation } =
      await req.json()

    // Validate required fields
    if (!projectSlug || !tonnes || !buyerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!buyerName && !isAnonymous) {
      return NextResponse.json(
        { error: 'Name is required unless staying anonymous' },
        { status: 400 }
      )
    }

    // Fetch project from hardcoded data (Phase 4 will switch to Supabase)
    const project = getProjectBySlug(projectSlug)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Calculate pricing
    const tonnesNum = Number(tonnes)
    const carbonCostGbp = project.pricePerTonneGbp * tonnesNum
    const platformFeeGbp = carbonCostGbp * PLATFORM_FEE_RATE
    const totalGbp = carbonCostGbp + platformFeeGbp
    const totalPence = Math.round(totalGbp * 100)

    // Generate certificate ID
    const certificateId = randomUUID()

    const displayName = isAnonymous ? 'Anonymous' : buyerName

    const creditTypeLabel =
      project.creditType === 'removal' ? 'carbon removal' : 'emissions avoidance'

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onemillion-earth.vercel.app'

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `${project.name} — ${tonnesNum} ${tonnesNum === 1 ? 'tonne' : 'tonnes'} of verified ${creditTypeLabel}`,
              description: `Funding verified ${creditTypeLabel} via ${project.registry}. Carbon cost: £${carbonCostGbp.toFixed(2)} · Platform fee (18%): £${platformFeeGbp.toFixed(2)}`,
            },
            unit_amount: totalPence,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/project/${projectSlug}`,
      customer_email: buyerEmail,
      metadata: {
        projectSlug,
        projectName: project.name,
        creditType: project.creditType,
        registry: project.registry,
        tonnes: String(tonnesNum),
        buyerName: displayName,
        buyerEmail,
        isAnonymous: String(isAnonymous ?? false),
        organisation: organisation || '',
        carbonCostGbp: String(carbonCostGbp.toFixed(2)),
        platformFeeGbp: String(platformFeeGbp.toFixed(2)),
        totalGbp: String(totalGbp.toFixed(2)),
        certificateId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
