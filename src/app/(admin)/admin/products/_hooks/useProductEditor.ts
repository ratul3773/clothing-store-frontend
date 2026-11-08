"use client";

import { useNavigate } from "@/lib/nav";
import { useGetAdminProductQuery } from "@/redux/apis/product.api";

export default function useProductEditor({ productId }: { productId: string }) {
  const go = useNavigate();
  const { data, isLoading, isError, error, refetch } = useGetAdminProductQuery({
    id: productId,
  });
  return { go, data, isLoading, isError, error, refetch };
}
