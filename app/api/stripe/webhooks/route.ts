/*
<ai_context>
This API route handles Stripe webhook events to manage subscription status changes and updates user profiles accordingly.
</ai_context>
*/

import {
  manageSubscriptionStatusChange,
  updateStripeCustomer
} from "@/actions/stripe-actions"
import { updateProfileByStripeCustomerIdAction } from "@/actions/db/profiles-actions"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "payment_intent.succeeded"
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get("Stripe-Signature") as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret) {
      throw new Error("Webhook secret or signature missing")
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await handleSubscriptionChange(event)
          break

        case "checkout.session.completed":
          await handleCheckoutSession(event)
          break

        case "payment_intent.succeeded":
          await handlePaymentIntent(event)
          break

        default:
          throw new Error("Unhandled relevant event!")
      }
    } catch (error) {
      console.error("Webhook handler failed:", error)
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        {
          status: 400
        }
      )
    }
  }

  return new Response(JSON.stringify({ received: true }))
}

async function handleSubscriptionChange(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  const productId = subscription.items.data[0].price.product as string
  await manageSubscriptionStatusChange(
    subscription.id,
    subscription.customer as string,
    productId
  )
}

async function handleCheckoutSession(event: Stripe.Event) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session
  if (checkoutSession.mode === "subscription") {
    const subscriptionId = checkoutSession.subscription as string
    await updateStripeCustomer(
      checkoutSession.client_reference_id as string,
      subscriptionId,
      checkoutSession.customer as string
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"]
    })

    const productId = subscription.items.data[0].price.product as string
    await manageSubscriptionStatusChange(
      subscription.id,
      subscription.customer as string,
      productId
    )
  } else if (checkoutSession.mode === "payment") {
    // Handle one-time payment for credit top-ups
    await handleOneTimePayment(checkoutSession)
  }
}

async function handlePaymentIntent(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent

  // If this payment intent is for a credit top-up (check metadata)
  if (paymentIntent.metadata.type === "credit_topup") {
    const customerId = paymentIntent.customer as string
    const creditAmount = parseInt(paymentIntent.metadata.credits || "0")

    // Query the database directly for user profile information instead of using Stripe
    const { data: userProfile } = await updateProfileByStripeCustomerIdAction(
      customerId,
      {
        credits: creditAmount.toString() // Add the credits directly
      }
    )
  }
}

async function handleOneTimePayment(session: Stripe.Checkout.Session) {
  // Get the line items to determine what was purchased
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

  // Find the credit top-up product
  const item = lineItems.data[0]
  if (!item) return

  // Get the product details to find the metadata with credit amount
  const productId = item.price?.product as string
  const product = await stripe.products.retrieve(productId)
  const creditAmount = product.metadata.credits
    ? parseInt(product.metadata.credits)
    : 0

  if (creditAmount > 0) {
    // Get the current user profile from the database
    const customerId = session.customer as string

    // Update credits directly with the database action
    // This will add the credits to the existing amount
    await updateProfileByStripeCustomerIdAction(customerId, {
      // Use SQL increment operation instead of fetching current value
      credits: `credits + ${creditAmount}`
    })
  }
}
