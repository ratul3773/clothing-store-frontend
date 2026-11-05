"use client";

import usePagination from "@/lib/usePagination";
import ProductCard from "@/components/common/ProductCard";
import Pagination from "@/components/common/Pagination";
import ProductGridSkeleton from "@/components/common/ProductSkeleton/ProductGridSkeleton";
import { Button } from "@/components/ui/button";
import { useStore } from "@/components/providers/StoreProvider";
import { useGetProductsByIdsQuery } from "@/redux/apis/product.api";
import { toStorefrontProducts } from "@/lib/public-product";

export default function WishlistTab() {
  const { wishlist } = useStore();
  return wishlist.length ? <WishlistProducts key={wishlist.join(",")} ids={wishlist} /> : <p className="text-muted-foreground">Nothing saved yet.</p>;
}

function WishlistProducts({ ids }: { ids: string[] }) {
  const query = useGetProductsByIdsQuery(ids);
  const items = toStorefrontProducts(query.currentData ?? []);
  const pagination = usePagination(items, 4);
  if (query.isFetching) return <ProductGridSkeleton count={4} />;
  if (query.isError) return <div role="alert"><p>Could not load saved items.</p><Button onClick={() => void query.refetch()}>Retry wishlist</Button></div>;
  return <>
    {items.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{pagination.pageItems.map((p, index) => <ProductCard key={p.id} p={p} index={index} />)}</div> : <p className="text-muted-foreground">Your saved items are currently unavailable.</p>}
    {items.length > 4 && <Pagination paginationInfo={{ page: pagination.page, limit: 4, total: items.length, totalPage: pagination.pageCount }} onPageChange={pagination.setPage} />}
  </>;
}
