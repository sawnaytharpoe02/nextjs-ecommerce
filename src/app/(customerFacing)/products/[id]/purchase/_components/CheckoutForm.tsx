"use client";

import React, { FormEvent, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { userOrderExists } from "@/app/actions/orders";
import Image from "next/image";

type CheckoutFormProps = {
  product: {
    id: string;
    name: string;
    priceInCents: number;
    isAvailableForPurchase: boolean;
    description: string;
    imagePath: string;
  };
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const CheckoutForm = ({ product, clientSecret }: CheckoutFormProps) => {
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
        </div>
      </div>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInCents={product.priceInCents} productId={product.id} />
      </Elements>
    </div>
  );
};

export default CheckoutForm;

type FormProps = {
  productId: string;
  priceInCents: number;
};
const Form = ({ productId, priceInCents }: FormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !email) return;

    setIsLoading(true);

    const orderExists = await userOrderExists(productId, email);

    if (orderExists) {
      setErrorMessage("You have already purchased this product.");
      setIsLoading(false);
      return;
    }

    const appUrl = process.env.NEXT_PULIC_APP_URL || 'http://localhost:3000';
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${appUrl}/stripe/purchase-success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setErrorMessage(error.message);
    } else {
      setErrorMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription className="text-destructive">
            {errorMessage && <div>{errorMessage}</div>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full mt-4"
            disabled={isLoading || !stripe || !elements}>
            {isLoading
              ? "Purchasing ..."
              : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};



