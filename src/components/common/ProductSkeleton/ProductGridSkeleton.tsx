
import ProductCardSkeleton from "./ProductSkeleton";

type ProductGridSkeletonProps = {
  count?: number;
  className?: string;
};

export default function ProductGridSkeleton({
  count = 8,
  className,
}: ProductGridSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className={className ?? "grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4"}
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}

      <span className="sr-only">Loading products...</span>
    </div>
  );
}
