"use client";

import { Card, CardHeader } from "@/components/cms/ui";

import SubcategoriesPanel from "./SubcategoriesPanel";
import type { Category } from "@/redux/apis/types/category.types";

export default function CategoryDetail({ category }: { category: Category }) {
  return (
    <Card>
      <CardHeader
        title={category.name}
        description="Manage child categories for this parent."
      />
      <SubcategoriesPanel parent={category} />
    </Card>
  );
}
