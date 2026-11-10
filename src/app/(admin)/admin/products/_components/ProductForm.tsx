"use client";

import { CmsButton } from "@/components/ui/button";
import useProductEditor from "../_hooks/useProductEditor";

import { Empty } from "@/components/cms/ui";
import { apiErrorMessage } from "@/redux/api.utils";

import ProductCreateForm from "./ProductCreateForm";
import ProductDetailSkeleton from "./ProductDetailSkeleton";
import ProductEditForm from "./ProductEditForm";

export default function ProductForm({ productId }: { productId?: string }) {
  if (!productId) return <ProductCreateForm />;
  return <ProductEditor productId={productId} />;
}

function ProductEditor({ productId }: { productId: string }) {
  const { go, data, isLoading, isError, error, refetch } = useProductEditor({ productId });

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
            <CmsButton variant="outline" onClick={() => go("/admin/products")}>Back to products</CmsButton>
            <CmsButton variant="default" onClick={() => void refetch()}>
              Try again
            </CmsButton>
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
