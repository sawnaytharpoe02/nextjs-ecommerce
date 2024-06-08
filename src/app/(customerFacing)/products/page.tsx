import React, { Suspense } from "react";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import db from "@/db";

const ProductsPage = () => {
  return (
    <div className="container my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <ProductCardSkeleton />
              ))}
          </>
        }>
        <SuspenseCard />
      </Suspense>
    </div>
  );
};

export default ProductsPage;

const SuspenseCard = async () => {
  const products = await db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { name: "asc" },
  });

  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
};
