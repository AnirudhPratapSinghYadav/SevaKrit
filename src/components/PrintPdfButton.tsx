type PrintPdfButtonProps = {
  label: string;
  className?: string;
};

/** Triggers the browser print dialog — use “Save as PDF” for a print-styled sheet. */
export default function PrintPdfButton({ label, className }: PrintPdfButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ??
        "btn-gold pressable no-print inline-flex min-h-12 items-center justify-center rounded-full px-6 font-semibold"
      }
    >
      {label}
    </button>
  );
}
