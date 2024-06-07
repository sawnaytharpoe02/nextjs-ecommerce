import db from "@/db";
import ProductForm from "../../_components/ProductForm";
import PageHeader from "@/app/admin/_components/PageHeader";
import { notFound } from "next/navigation";

const EditProductPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const product = await db.product.findUnique({ where: { id } });
  if(!product) notFound();

  return (
    <div>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </div>
  );
};

export default EditProductPage;
