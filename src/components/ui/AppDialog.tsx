import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";

type AppDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/**
 * Accessible modal: portal, Escape, body scroll lock.
 * Pattern from Nagarakshak GlassModal; styled with HaqPath ivory/forest surfaces (no glass void theme).
 */
export default function AppDialog({
  open,
  onClose,
  title,
  titleId = "haqpath-dialog-title",
  children,
  footer,
  className,
}: AppDialogProps) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative z-10 flex max-h-[min(90vh,900px)] w-full max-w-md flex-col overflow-hidden rounded-md border border-border bg-surface shadow-lg",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 id={titleId} className="font-display text-lg font-semibold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border text-ink"
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <div className="overflow-y-auto px-4 py-3 text-sm text-ink-soft">{children}</div>
        {footer !== undefined && (
          <footer className="flex flex-wrap justify-end gap-2 border-t border-border px-4 py-3">{footer}</footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
