import React from "react";
import PageHeader from "../_components/PageHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductsTable from "./_components/ProductTable";

export const dynamic = "force-dynamic";

const ProductsPage = ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    count?: string;
  };
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href={"/admin/products/new"}>New Products</Link>
        </Button>
      </div>
      <ProductsTable
        query={searchParams?.query || ""}
        currentPage={Number(searchParams?.page) || 1}
        itemsPerPage={Number(searchParams?.count) || 6}
      />
    </div>
  );
};

export default ProductsPage;
