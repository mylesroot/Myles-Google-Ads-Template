/*
<ai_context>
This API route creates Stripe checkout sessions for subscriptions and one-time payments.
</ai_context>
*/

import { stripe } from "@/lib/stripe"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { priceId, mode, successUrl, cancelUrl } = await req.json()

    if (!priceId || !mode || !successUrl || !cancelUrl) {
      return new NextResponse("Missing required parameters", { status: 400 })
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: undefined, // Clerk will provide this
      client_reference_id: userId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: mode as "subscription" | "payment",
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
