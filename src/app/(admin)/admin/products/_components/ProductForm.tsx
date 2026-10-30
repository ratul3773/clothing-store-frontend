"use client";

import { Btn, Card, Empty } from "@/components/cms/ui";
import { useNavigate } from "@/lib/nav";
import { apiErrorMessage } from "@/redux/api.utils";
import { useGetAdminProductQuery } from "@/redux/apis/product.api";

import ProductCreateForm from "./ProductCreateForm";
import ProductEditForm from "./ProductEditForm";
import ProductDetailSkeleton from "./ProductDetailSkeleton";

export default function ProductForm({ productId }: { productId?: string }) {
  if (!productId) return <ProductCreateForm />;
  return <ProductEditor productId={productId} />;
}

function ProductEditor({ productId }: { productId: string }) {
  const go = useNavigate();
  const { data, isLoading, isError, error, refetch } = useGetAdminProductQuery({
    id: productId,
  });

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <Empty
        title="Product not found"
        description={apiErrorMessage(
          error,
          "It may have been deleted, or the API is unavailable.",
        )}
        action={
          <div className="flex gap-2">
            <Btn onClick={() => go("/admin/products")}>Back to products</Btn>
            <Btn variant="primary" onClick={() => void refetch()}>
              Try again
            </Btn>
          </div>
        }
      />
    );
  }

  return (
    <ProductEditForm
      key={data.id}
      product={data}
      reload={async () => {
        const result = await refetch();
        if (result.data) return result.data;
        throw result.error ?? new Error("The product could not be reloaded.");
      }}
    />
  );
}
