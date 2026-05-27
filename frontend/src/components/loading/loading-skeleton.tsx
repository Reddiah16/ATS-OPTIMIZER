import { cn } from "@/lib/utils";

type LoadingSkeletonProps = {
  className?: string;
  rows?: number;
};

export function LoadingSkeleton({ className, rows = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-12 rounded-xl" />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-surface-950">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-12">
        <div className="skeleton h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="skeleton h-64 rounded-2xl" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
