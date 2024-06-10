"use server";

import db from "@/db";
import { notFound } from "next/navigation";

export async function DeleteOrder(id: string) {
  const order = await db.order.findUnique({ where: { id } });
  if (!order) return notFound();

  await db.order.delete({ where: { id } });
}
