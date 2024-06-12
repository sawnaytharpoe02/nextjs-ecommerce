import React from "react";
import PageHeader from "../_components/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import db from "@/db";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  DotsVerticalIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatCurrency } from "@/utils/formatters";
import {
  ActivateToggleDropDownItem,
  DeleteDropDownItem,
} from "./_components/ProductActions";
import PagePagination from "../_components/PagePagination";
import { fetchFilteredProducts, fetchProductsPage } from "@/app/actions/orders";

export const dynamic = "force-dynamic";

const ProductsPage = ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
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
      />
    </div>
  );
};

export default ProductsPage;

export const ProductsTable = async ({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) => {
  const totalPages = await fetchProductsPage(query);
  const products = await fetchFilteredProducts(query, currentPage);

  console.log(products);

  if (products.length === 0) return <div>Products not found.</div>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <span className="sr-only">Avaliable For Purchase</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, i) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.isAvailableForPurchase ? (
                  <CheckCircledIcon className="w-5 h-5" />
                ) : (
                  <CrossCircledIcon className="w-5 h-5 text-destructive" />
                )}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {formatCurrency(product.priceInCents / 100)}
              </TableCell>
              <TableCell>{product._count.orders}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <DotsVerticalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <a
                        download
                        href={`/admin/products/${product.id}/download`}>
                        Download
                      </a>
                    </DropdownMenuItem>
                    <ActivateToggleDropDownItem
                      id={product.id}
                      isAvailableForPurchase={product.isAvailableForPurchase}
                    />
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DeleteDropDownItem
                      id={product.id}
                      disabled={product._count.orders > 0}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-5 flex w-full justify-center">
        <PagePagination totalPages={totalPages} />
      </div>
    </>
  );
};
