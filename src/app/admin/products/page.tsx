import React from "react";
import PageHeader from "../_components/PageHeader";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ProductsPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader>Products</PageHeader>
        <Button>
          <Link href={'/admin/products/new'}>New Products</Link>
        </Button>
      </div>
      <ProductsTable />
    </div>
  );
};

export default ProductsPage;

export const ProductsTable = () => {
  return (
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
      <TableBody></TableBody>
    </Table>
  );
};
