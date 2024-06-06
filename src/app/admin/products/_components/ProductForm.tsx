"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addProduct } from "@/app/admin/_action/products";

const ProductForm = () => {
  const [priceInCents, setPriceInCents] = useState<number | undefined>();

  return (
    <div>
      <form action={addProduct} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" name="name" />
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">File</Label>
          <Input type="file" id="name" name="file" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="img">Image</Label>
          <Input type="file" id="img" name="img" />
        </div>

        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};

export default ProductForm;
