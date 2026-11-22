import { cn } from "../../lib/cn";

const SIZES = {
  sm: "h-4 w-4 border",
  md: "h-8 w-8 border-2",
  lg: "h-10 w-10 border-2",
} as const;

type LoadingSpinnerProps = {
  size?: keyof typeof SIZES;
  overlay?: boolean;
  label?: string;
  className?: string;
};

/**
 * Spinner uses <span> so it stays valid inside buttons (Nagarakshak LoadingSpinner pattern).
 * Colours follow HaqPath forest green, not Nagarakshak void/glass.
 */
export default function LoadingSpinner({
  size = "md",
  overlay = false,
  label = "Loading",
  className,
}: LoadingSpinnerProps) {
  const spinner = (
    <span
      className={cn(
        "inline-block shrink-0 animate-spin rounded-full border-border border-t-ink align-middle",
        SIZES[size],
        className,
      )}
      role="status"
      aria-label={label}
    />
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }
  return spinner;
}
