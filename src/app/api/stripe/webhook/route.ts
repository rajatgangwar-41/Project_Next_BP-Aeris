import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
    console.log("🚀 ~ POST ~ event:", event);
  } catch (error) {
    return new NextResponse("webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  console.log("🚀 ~ POST ~ session:", session);
  console.log(event.type);

  // new subscription created
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
      {
        expand: ["items.data.price.product"],
      },
    );
    console.log("🚀 ~ POST ~ subscription:", subscription);
    if (!session?.client_reference_id) {
      return new NextResponse("no userid", { status: 400 });
    }
    const plan = subscription.items.data[0]?.price;
    console.log("🚀 ~ POST ~ plan:", plan);

    if (!plan) {
      throw new Error("No plan found for this subscription.");
    }

    const productId = (plan.product as Stripe.Product).id;
    console.log("🚀 ~ POST ~ productId:", productId);

    if (!productId) {
      throw new Error("No product ID found for this subscription.");
    }

    await db.stripeSubscription.create({
      data: {
        subscriptionId: subscription.id,
        productId: productId,
        priceId: plan.id,
        customerId: subscription.customer as string,
        currentPeriodEnd: new Date(
          subscription.items.data[0]?.current_period_end! * 1000,
        ),
        userId: session.client_reference_id,
      },
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
      {
        expand: ["items.data.price.product"],
      },
    );
    const plan = subscription.items.data[0]?.price;

    if (!plan) {
      throw new Error("No plan found for this subscription.");
    }

    const productId = (plan.product as Stripe.Product).id;

    await db.stripeSubscription.update({
      where: {
        subscriptionId: subscription.id,
      },
      data: {
        currentPeriodEnd: new Date(
          subscription.items.data[0]?.current_period_end! * 1000,
        ),
        productId: productId,
        priceId: plan.id,
      },
    });
    return NextResponse.json({ message: "success" }, { status: 200 });
  }

  if (event.type === "customer.subscription.updated") {
    console.log("subscription updated", session);
    const subscription = await stripe.subscriptions.retrieve(
      session.id as string,
    );

    const existingSubscription = await db.stripeSubscription.findUnique({
      where: { subscriptionId: session.id as string },
    });

    if (!existingSubscription) {
      return new Response("Subscription not found", { status: 200 });
    }

    await db.stripeSubscription.update({
      where: {
        subscriptionId: session.id as string,
      },
      data: {
        updatedAt: new Date(),
        currentPeriodEnd: new Date(
          subscription.items.data[0]?.current_period_end! * 1000,
        ),
      },
    });
    return NextResponse.json({ message: "success" }, { status: 200 });
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
}
