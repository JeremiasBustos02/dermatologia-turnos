export const AppointmentsTableSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
    <div className="w-full animate-pulse divide-y divide-slate-100">
      {[1, 2, 3].map((row) => (
        <div key={row} className="p-5 flex items-center gap-4">
          <div className="h-5 bg-slate-200 rounded w-12" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-200 rounded w-1/4" />
          </div>
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="h-6 bg-slate-200 rounded w-16" />
          <div className="h-7 bg-slate-200 rounded w-20 ml-auto" />
        </div>
      ))}
    </div>
  </div>
);
