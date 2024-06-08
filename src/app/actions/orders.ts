"use server";

import db from "@/db";

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
