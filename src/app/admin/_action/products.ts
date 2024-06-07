"use server";

import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import db from "@/db";
import fs from "fs/promises";

const fileSchema = z.instanceof(File, { message: "required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/"),
  {
    message: "required",
  }
);

const addSchema = z.object({
  name: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  description: z.string().min(1),
  file: fileSchema.refine((file) => file.size > 0, "required file"),
  img: imageSchema.refine((file) => file.size > 0, "required image"),
});

export const addProduct = async (formData: FormData) => {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    console.log(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.img.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.img.arrayBuffer())
  );

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      priceInCents: data.priceInCents,
      description: data.description,
      filePath,
      imagePath,
    },
  });

  redirect("/admin/products");
};

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return notFound();

  await db.product.update({
    where: { id },
    data: {
      isAvailableForPurchase,
    },
  });
}

export async function DeleteProduct(id: string) {
  const product = await db.product.findUnique({ where: { id } });
  if (!product) return notFound();

  await db.product.delete({ where: { id } });

  fs.unlink(product.filePath);
  fs.unlink(`public${product.imagePath}`);
}
