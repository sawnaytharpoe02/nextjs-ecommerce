"use server";

import db from "@/db";
import { notFound } from "next/navigation";

export async function DeleteUser(id: string) {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return notFound();

  await db.user.delete({ where: { id } });
}
