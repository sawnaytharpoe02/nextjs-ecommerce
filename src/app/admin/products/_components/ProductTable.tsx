import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "./ProductActions";
import { fetchProductsPage, fetchFilteredProducts } from "@/app/actions/orders";
import PagePagination from "../../_components/PagePagination";
import Link from "next/link";

const ProductsTable = async ({
  query,
  currentPage,
  itemsPerPage,
}: {
  query: string;
  currentPage: number;
  itemsPerPage: number;
}) => {
  const totalPages = await fetchProductsPage(query, itemsPerPage);
  const products = await fetchFilteredProducts(
    query,
    currentPage,
    itemsPerPage
  );

  if (products.length === 0) return <div>Products not found.</div>;

  return (
    <div className="h-[65vh] flex flex-col mt-2">
      <div className="h-[50vh] overflow-auto">
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
      </div>
      <div className="flex h-[15vh] w-full justify-center mt-auto items-end">
        <PagePagination totalPages={totalPages} itemsPerPage={itemsPerPage} />
      </div>
    </div>
  );
};

export default ProductsTable;
