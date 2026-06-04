export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const TableSkeleton = () => (
  <div className="space-y-3 w-full">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex gap-4 p-4 border-b border-slate-100">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    ))}
  </div>
);