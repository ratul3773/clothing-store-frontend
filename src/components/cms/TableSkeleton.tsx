import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton({
  columns,
  rows = 6,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <div aria-label="Loading table" aria-busy="true" role="status" className="overflow-hidden">
      <div className="border-b border-border bg-muted/50 px-3 py-3">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton key={index} className="h-3 w-3/5 rounded-sm" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div
          key={row}
          className="grid items-center gap-4 border-b border-border px-3 py-4 last:border-0"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }, (_, column) => (
            <Skeleton
              key={column}
              className={column === 0 ? "h-9 w-4/5 rounded-sm" : "h-4 w-3/5 rounded-sm"}
            />
          ))}
        </div>
      ))}
      <span className="sr-only">Loading table...</span>
    </div>
  );
}
