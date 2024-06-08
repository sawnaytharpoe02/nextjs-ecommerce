import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Product } from "@prisma/client";
import db from "@/db";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Suspense } from "react";
import { cache } from "@/utils/cache";
import { revalidatePath } from "next/cache";

const wait = (duration: number) => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};

const getMostPopularProducts = cache(
  async () => {
    await wait(2000);
    return await db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    });
  },
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 }
);

const getNewestProducts = cache(async () => {
  await wait(2500);
  return await db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}, ["/", "getNewestProducts"]);

const HomePage = () => {
  return (
    <div className="space-y-12">
      <ProductGridSection
        title="Most Popular"
        href="/products"
        productsFetcher={getMostPopularProducts}
      />

      <ProductGridSection
        title="Newest"
        href="/products"
        productsFetcher={getNewestProducts}
      />
    </div>
  );
};

export default HomePage;

type ProductGridSectionProps = {
  title: string;
  href: string;
  productsFetcher: () => Promise<Product[]>;
};
const ProductGridSection = ({
  title,
  href,
  productsFetcher,
}: ProductGridSectionProps) => {
  return (
    <div>
      <div className="flex items-center space-x-8">
        <h3 className="text-3xl font-semibold">{title}</h3>
        <Button
          asChild
          className="bg-secondary text-primary hover:bg-secondary">
          <Link href={href} style={{ display: "flex", gap: 6 }}>
            <p>View All</p> <ArrowRightIcon />
          </Link>
        </Button>
      </div>

      <div className="container my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <ProductCardSkeleton />
                ))}
            </>
          }>
          <SuspenseCard productsFetcher={productsFetcher} />
        </Suspense>
        {}
      </div>
    </div>
  );
};

const SuspenseCard = async ({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>;
}) => {
  return (await productsFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
};
