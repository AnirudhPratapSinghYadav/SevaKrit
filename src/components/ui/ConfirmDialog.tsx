import AppDialog from "./AppDialog";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirm/cancel wrapper — Nagarakshak ConfirmModal pattern in HaqPath styling. */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AppDialog
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-md border border-border px-4 font-semibold text-ink"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              danger
                ? "min-h-11 rounded-md border border-error-ink bg-error-ink px-4 font-semibold text-canvas"
                : "min-h-11 rounded-md bg-ink px-4 font-semibold text-canvas"
            }
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </AppDialog>
  );
}
