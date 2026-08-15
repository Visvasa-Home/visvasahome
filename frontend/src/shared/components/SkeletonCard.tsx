interface SkeletonCardProps {
  variant?: 'card' | 'list-item' | 'category-icon' | 'profile';
  count?: number;
  className?: string;
}

function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-100 rounded-xl ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

function ServiceCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 shadow-sm">
      <div className="flex-1 space-y-3">
        <div className="flex gap-2 items-center">
          <Shimmer className="h-5 w-2/3" />
          <Shimmer className="h-4 w-16 rounded-full" />
        </div>
        <div className="flex gap-3">
          <Shimmer className="h-4 w-16" />
          <Shimmer className="h-4 w-20" />
          <Shimmer className="h-4 w-16" />
        </div>
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-4/5" />
        <Shimmer className="h-3 w-16 mt-1" />
      </div>
      <div className="flex-shrink-0 self-center">
        <Shimmer className="h-10 w-20 rounded-2xl" />
      </div>
    </div>
  );
}

function ListItem() {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100">
      <Shimmer className="w-10 h-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-3 w-3/5" />
        <Shimmer className="h-2.5 w-2/5" />
      </div>
      <Shimmer className="w-4 h-4 rounded-full flex-shrink-0" />
    </div>
  );
}

function CategoryIcon() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Shimmer className="w-14 h-14 rounded-2xl" />
      <Shimmer className="h-2.5 w-12" />
      <Shimmer className="h-2 w-8" />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4">
      <Shimmer className="w-14 h-14 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-1/2" />
        <Shimmer className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonCard({
  variant = 'card',
  count = 1,
  className = '',
}: SkeletonCardProps) {
  const Component = {
    card: ServiceCard,
    'list-item': ListItem,
    'category-icon': CategoryIcon,
    profile: ProfileSkeleton,
  }[variant];

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}
