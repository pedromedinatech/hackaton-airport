import { Skeleton } from "@/components/ui/Skeleton";

export default function FlyLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-24" />
      <div className="space-y-3 rounded-2xl border border-white/[0.06] bg-surface p-4">
        <Skeleton className="h-11 w-full rounded-2xl" />
        <Skeleton className="h-11 w-full rounded-2xl" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-2xl" />
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[72px] w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
