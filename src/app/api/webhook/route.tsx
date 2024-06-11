import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import Stripe from "stripe";
import { Resend } from "resend";
import PurchaseReceiptEmailTemplate from "@/email/PurchaseReceiptEmailTemplate";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  
  let event: Stripe.Event;
  try {
    if (!sig || !webhookSecret)
      return new Response("Webhook secret not found.", { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔  Webhook received: ${event.type}`);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "charge.succeeded") {
    try {
      const charge = event.data.object;
      const productId = charge.metadata.productId;
      const email = charge.billing_details.email;
      const priceInCents = charge.amount;

      if (!productId || !email) {
        console.error("Missing productId or email in charge metadata");
        return new NextResponse("Bad Request", { status: 400 });
      }

      const product = await db.product.findUnique({ where: { id: productId } });
      if (product == null) {
        console.error("Product not found:", productId);
        return new NextResponse("Product Not Found", { status: 404 });
      }

      const userFields = {
        email,
        orders: { create: { productId, pricePaidInCents: priceInCents } },
      };

      const {
        orders: [order],
      } = await db.user.upsert({
        where: { email },
        create: userFields,
        update: userFields,
        select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
      });

      const downloadVerification = await db.downloadVerification.create({
        data: {
          productId: product.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      await resend.emails.send({
        from: `Support <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: "Order Confirmation",
        react: (
          <PurchaseReceiptEmailTemplate
            order={order}
            product={product}
            downloadVerificationId={downloadVerification.id}
          />
        ),
      });

      return new NextResponse(null, { status: 200 });
    } catch (err) {
      console.error("Error handling charge.succeeded event:", err);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  return new NextResponse();
}
