import { useEffect, useState } from "react";

/**
 * Renders a QR for a public URL using a same-origin SVG built without household data.
 * Uses the lightweight `qr-code-styling`-free path: browser BarcodeDetector is unavailable
 * for encoding, so we draw via a dynamic import of the `qrcode` package when present,
 * otherwise show the URL for manual copy (still privacy-safe).
 */
export default function PublicQr({ payload, label }: { payload: string; label: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const mod = await import("qrcode");
        const url = await mod.toDataURL(payload, {
          errorCorrectionLevel: "M",
          margin: 1,
          width: 192,
          color: { dark: "#173B35", light: "#F7F5F0" },
        });
        if (!cancelled) setDataUrl(url);
      } catch {
        if (!cancelled) setError("QR library unavailable — use the public link below.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [payload]);

  return (
    <figure className="flex flex-col gap-2">
      {dataUrl !== null ? (
        <img src={dataUrl} width={192} height={192} alt={label} className="rounded-md border border-border" />
      ) : (
        <p className="text-sm text-ink-soft">{error ?? "Preparing QR…"}</p>
      )}
      <figcaption className="break-all text-sm text-ink-soft">{payload}</figcaption>
    </figure>
  );
}
