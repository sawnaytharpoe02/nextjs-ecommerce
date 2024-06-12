"use server";

import db from "@/db";
import { z } from "zod";
import { Resend } from "resend";
import OrderHistoryEmailTemplate from "@/email/OrderHistoryEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY as string);
const ITEMS_PER_PAGE = 6;

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

export const fetchFilteredProducts = async (
  query: string,
  currentPage: number
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  let priceFilter = {};

  // Try to parse the query as an integer
  const parsedPrice = parseInt(query, 10);
  if (!isNaN(parsedPrice)) {
    priceFilter = { priceInCents: parsedPrice };
  }

  const products = await db.product.findMany({
    skip: offset,
    take: ITEMS_PER_PAGE,
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        priceFilter,
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      isAvailableForPurchase: true,
      priceInCents: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return products;
};

export const fetchProductsPage = async (query: string) => {
  let priceFilter = {};

  // Try to parse the query as an integer
  const parsedPrice = parseInt(query, 10);
  if (!isNaN(parsedPrice)) {
    priceFilter = { priceInCents: parsedPrice };
  }

  const count = await db.product.count({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        priceFilter,
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
  });

  const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
  return totalPages;
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
