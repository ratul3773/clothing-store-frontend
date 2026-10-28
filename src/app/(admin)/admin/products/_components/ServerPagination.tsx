"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Btn } from "@/components/cms/ui";
import type { PageMeta } from "@/redux/api.utils";

type Props = {
  meta?: PageMeta;
  page: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
};

export default function ServerPagination({
  meta,
  page,
  onPageChange,
  loading,
}: Props) {
  if (!meta || meta.total === 0) return null;

  const from = (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted-foreground">
      <span>
        {from}–{to} of {meta.total}
      </span>
      <div className="flex items-center gap-1">
        <Btn
          size="icon"
          className="size-7"
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Btn>
        <span className="px-2">
          Page {meta.page} / {Math.max(meta.totalPage, 1)}
        </span>
        <Btn
          size="icon"
          className="size-7"
          disabled={page >= meta.totalPage || loading}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Btn>
      </div>
    </div>
  );
}
