import { Skeleton } from "@/components/ui/Skeleton";

export default function HelpLoading() {
  return (
    <div className="flex h-[calc(100svh-11rem)] flex-col">
      <div className="flex items-center gap-2.5 pb-3">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-44 rounded" />
        </div>
      </div>
      <div className="flex-1 space-y-3">
        <Skeleton className="h-16 w-4/5 rounded-2xl" />
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-9 w-40 rounded-full" />
          ))}
        </div>
      </div>
      <Skeleton className="h-11 w-full rounded-2xl" />
    </div>
  );
}
