import { useCallback, useRef, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Lightweight CSS 3D tilt from pointer position. No-ops under reduced motion. */
export function usePointerTilt(maxDeg = 8): {
  ref: RefObject<HTMLDivElement | null>;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
} {
  const ref = useRef<HTMLDivElement | null>(null);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const node = ref.current;
      if (!node) return;
      if (prefersReducedMotion()) return;
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotY = (x - 0.5) * maxDeg * 2;
      const rotX = (0.5 - y) * maxDeg * 2;
      node.style.setProperty("--tilt-x", `${rotX.toFixed(2)}deg`);
      node.style.setProperty("--tilt-y", `${rotY.toFixed(2)}deg`);
    },
    [maxDeg],
  );

  const onPointerLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
