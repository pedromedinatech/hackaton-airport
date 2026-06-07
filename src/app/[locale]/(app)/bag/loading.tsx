import { Skeleton } from "@/components/ui/Skeleton";

export default function BagLoading() {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="rounded-2xl border border-white/[0.06] bg-surface p-5 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mx-auto h-40 w-40 rounded-2xl" />
        <Skeleton className="h-11 w-full rounded-2xl" />
      </div>
    </div>
  );
}
