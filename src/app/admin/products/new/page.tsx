"use client";

import ProductForm from "../_components/ProductForm";
import PageHeader from "../../_components/PageHeader";

const NewProductPage = () => {
  return (
    <div>
      <PageHeader>Add Product</PageHeader>
      <ProductForm />
    </div>
  );
};

export default NewProductPage;
