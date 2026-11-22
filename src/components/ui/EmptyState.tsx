import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

/** Centre empty UI — adapted from Nagarakshak EmptyState into HaqPath tokens. */
export default function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-md border border-border bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      {description !== undefined && <p className="max-w-md text-sm text-ink-soft">{description}</p>}
      {action !== undefined && <div className="mt-2">{action}</div>}
    </div>
  );
}
