import { Skeleton } from "../ui/skeleton"

const TableSkeleton = () => {
  return (
    <div className="w-full overflow-auto">
      <div className="rounded-md border border-border overflow-hidden min-w-[800px]">
        <div className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-border bg-muted/40">
          {["title", "status", "priority", "assigned", "asignee", "data"].map((col) => (
            <Skeleton key={col} className="h-4 w-20" />
          ))}
        </div>

        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border last:border-0 shrink-0"
          >
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3 w-28 opacity-50" />
            </div>
            <Skeleton className="h-6 w-30 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="size-5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableSkeleton