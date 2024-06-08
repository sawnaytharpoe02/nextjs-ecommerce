import React from "react";
import db from "@/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import CheckoutForm from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const PurchaseProductPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return notFound();

  //create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    metadata: { productId: product.id },
  });

  //check if payment intent was created
  if (paymentIntent.client_secret == null) {
    throw new Error("Stripe failed to create payment intent");
  }

  return (
    <div>
      <CheckoutForm
        product={product}
        clientSecret={paymentIntent.client_secret}
      />
    </div>
  );
};

export default PurchaseProductPage;
