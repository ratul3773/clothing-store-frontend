import { ProductEditor } from "@/components/admin/catalog-workspace";

export default async function EditProductRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductEditor productId={id} />;
}
