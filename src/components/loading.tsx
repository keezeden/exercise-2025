type LoadingSkeletonVariant = "lines" | "boxes";

interface LoadingSkeletonProps {
  variant?: LoadingSkeletonVariant;
  count?: number;
  className?: string;
  itemClassName?: string;
  srLabel?: string;
}

const variantConfig: Record<
  LoadingSkeletonVariant,
  { container: string; item: string }
> = {
  lines: {
    container: "flex flex-col gap-2",
    item: "h-4 w-full rounded bg-gray-200",
  },
  boxes: {
    container: "flex gap-3",
    item: "h-20 w-20 rounded bg-gray-200",
  },
};

export function LoadingSkeleton({
  variant = "lines",
  count = 3,
  className = "",
  itemClassName = "",
  srLabel = "Loading content",
}: LoadingSkeletonProps) {
  const config = variantConfig[variant];
  const placeholders = Array.from(
    { length: Math.max(1, count) },
    (_, index) => (
      <div
        key={index}
        className={`${config.item} ${itemClassName}`.trim()}
        aria-hidden="true"
      />
    )
  );

  return (
    <div
      role="status"
      aria-live="polite"
      className={`animate-pulse ${config.container} ${className}`.trim()}
    >
      {placeholders}
      <span className="sr-only">{srLabel}</span>
    </div>
  );
}
