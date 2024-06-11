"use server";

import db from "@/db";
import { z } from "zod";
import { Resend } from "resend";
import OrderHistoryEmailTemplate from "@/email/OrderHistoryEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const userOrderExists = async (productId: string, email: string) => {
  const order = await db.order.findFirst({
    where: {
      productId,
      user: { email },
    },
    select: { id: true },
  });

  return order !== null;
};

const emailSchema = z.string().email();

export const emailOrderHistory = async (
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> => {
  const result = emailSchema.safeParse(formData.get("email"));

  if (!result.success) {
    return { error: "Invalid email address" };
  }

  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          id: true,
          pricePaidInCents: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (user == null) {
    return {
      message:
        "Check your email to view your order history and download your products.",
    };
  }

  const orders = await Promise.all(
    user.orders.map(async (order) => {
      return {
        ...order,
        downloadVerificationId: (
          await db.downloadVerification.create({
            data: {
              expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60),
              productId: order.product.id,
            },
          })
        ).id,
      };
    })
  );

  const data = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order History",
    react: <OrderHistoryEmailTemplate orders={orders} />,
  });

  if (data.error) {
    return {
      error: "There was an error sending your email. Please try again.",
    };
  }

  return {
    message:
      "Check your email to view your order history and download your products.",
  };
};
