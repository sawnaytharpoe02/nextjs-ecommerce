"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addProduct, updateProduct } from "@/app/admin/_action/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

const ProductForm = ({ product }: { product?: Product | null }) => {
  const [error, dispatch] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );

  return (
    <div>
      <form action={dispatch} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={product?.name || ""}
          />

          {error.name && (
            <p className="text-destructive text-sm">{error.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceInCents">Price In Cents</Label>
          <Input
            type="number"
            id="priceInCents"
            name="priceInCents"
            value={priceInCents}
            onChange={(e) =>
              setPriceInCents(Number(e.target.value) || undefined)
            }
          />
          <div>${formatNumber((priceInCents || 0) / 100)}</div>
          {error.priceInCents && (
            <p className="text-destructive text-sm">{error.priceInCents}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={product?.description || ""}
          />

          {error.description && (
            <p className="text-destructive text-sm">{error.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">File</Label>
          <Input type="file" id="name" name="file" />

          {product?.filePath && (
            <div className="text-sm">{product?.filePath}</div>
          )}

          {error.file && (
            <p className="text-destructive text-sm">{error.file}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="img">Image</Label>
          <Input type="file" id="img" name="img" />

          {product?.imagePath && (
            <div className="relative overflow-hidden">
              <Image
                src={product?.imagePath}
                alt={product.name}
                width={400}
                height={400}
              />
            </div>
          )}

          {error.img && <p className="text-destructive text-sm">{error.img}</p>}
        </div>

        <SubmitButton />
      </form>
    </div>
  );
};

export default ProductForm;

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
};
