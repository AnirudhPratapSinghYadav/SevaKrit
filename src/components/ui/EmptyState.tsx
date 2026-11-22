import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  imageSrc?: string;
};

/** Centre empty UI — adapted from Nagarakshak EmptyState into HaqPath tokens. */
export default function EmptyState({ title, description, action, className, imageSrc }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "glass-panel flex flex-col items-center justify-center gap-4 rounded-[1.75rem] px-6 py-12 text-center shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {imageSrc !== undefined && (
        <img
          src={imageSrc}
          alt=""
          width={320}
          height={240}
          className="mb-1 h-36 w-auto max-w-[16rem] rounded-2xl object-cover shadow-[var(--shadow-soft)]"
        />
      )}
      <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
      {description !== undefined && <p className="max-w-md text-sm text-ink-soft">{description}</p>}
      {action !== undefined && <div className="mt-1">{action}</div>}
    </div>
  );
}
