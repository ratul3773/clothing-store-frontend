/** Types mirroring the backend category module (`category.mapper.ts`). */

export type Category = {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  productCount: number;
  childCount: number;
  createdAt: string;
  updatedAt: string;
  /** Present on the public tree/detail responses only. */
  children?: Category[];
};

export type CreateCategoryPayload = {
  name: string;
  parentId?: string | null;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

/** Delete archives instead of deleting when products still reference the row. */
export type DeleteCategoryResult =
  | { deleted: false; archived: true; category: Category }
  | { deleted: true; archived: false };

/** A flat admin category row decorated with its tree depth for rendering. */
export type CategoryRow = Category & { depth: number };

export function toCategoryRows(categories: Category[]): CategoryRow[] {
  const byParent = new Map<string | null, Category[]>();

  for (const category of categories) {
    const key = category.parentId;
    const list = byParent.get(key) ?? [];
    list.push(category);
    byParent.set(key, list);
  }

  for (const list of byParent.values()) {
    list.sort(
      (a, b) =>
        a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
    );
  }

  const rows: CategoryRow[] = [];
  const seen = new Set<string>();

  const walk = (parentId: string | null, depth: number) => {
    for (const category of byParent.get(parentId) ?? []) {
      if (seen.has(category.id)) continue;
      seen.add(category.id);
      rows.push({ ...category, depth });
      walk(category.id, depth + 1);
    }
  };

  walk(null, 0);

  // Orphans (parent missing) should still be visible so they can be fixed.
  for (const category of categories) {
    if (!seen.has(category.id)) {
      rows.push({ ...category, depth: 0 });
    }
  }

  return rows;
}

/** Ancestor chain for a category, used to prevent parent cycles in the form. */
export function categoryDescendantIds(
  categories: Category[],
  id: string,
): Set<string> {
  const children = new Map<string, Category[]>();

  for (const category of categories) {
    if (!category.parentId) continue;
    const list = children.get(category.parentId) ?? [];
    list.push(category);
    children.set(category.parentId, list);
  }

  const ids = new Set<string>();
  const walk = (parentId: string) => {
    for (const child of children.get(parentId) ?? []) {
      if (ids.has(child.id)) continue;
      ids.add(child.id);
      walk(child.id);
    }
  };

  walk(id);
  return ids;
}
