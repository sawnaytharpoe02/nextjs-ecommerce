"use server";

import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import db from "@/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File, { message: "Required" });
  
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/"),
  {
    message: "Required",
  }
);

const addSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  priceInCents: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  description: z.string().min(1, { message: "Description is required." }),
  file: fileSchema.refine((file) => file.size > 0, "Required file."),
  img: imageSchema.refine((file) => file.size > 0, "Required image."),
});

const updateSchema = addSchema.extend({
  file: fileSchema.optional(),
  img: imageSchema.optional(),
});

export const addProduct = async (prevState: unknown, formData: FormData) => {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
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

  revalidatePath("/");
  revalidatePath("/products")

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

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = updateSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const product = await db.product.findUnique({ where: { id } });
  if (!product) return notFound();

  const data = result.data;

  let filePath = product.filePath;
  if (data.file != null && data.file.size > 0) {
    fs.unlink(product.filePath);
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
  }

  let imagePath = product.imagePath;
  if (data.img != null && data.img.size > 0) {
    fs.unlink(product.imagePath);
    imagePath = `/products/${crypto.randomUUID()}-${data.img.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.img.arrayBuffer())
    );
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      priceInCents: data.priceInCents,
      description: data.description,
      filePath,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/products")

  redirect("/admin/products");
}
