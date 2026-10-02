"use client";

import { useEffect, useRef } from "react";

const HOVER = "a,button,summary,label,select,[role=tab]";

function scroller(el: Element | null): HTMLElement {
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    const oy = getComputedStyle(n).overflowY;
    if ((oy === "auto" || oy === "scroll") && n.scrollHeight > n.clientHeight) return n as HTMLElement;
  }
  return document.scrollingElement as HTMLElement;
}

export default function Feel() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(pointer: fine)").matches;
    const ac = new AbortController();
    const on = { signal: ac.signal };
    let raf = 0;

    // Mouse wheels step in 100px jumps; trackpads already glide, so only coarse,
    // whole-notch deltas are eased.
    const targets = new Map<HTMLElement, number>();
    const glide = () => {
      raf = 0;
      for (const [el, to] of targets) {
        const d = to - el.scrollTop;
        if (Math.abs(d) < 0.5) {
          el.scrollTop = to;
          targets.delete(el);
        } else el.scrollTop += d * 0.16;
      }
      if (targets.size) raf = requestAnimationFrame(glide);
    };
    if (!calm) {
      addEventListener(
        "wheel",
        (e) => {
          const notch = e.deltaMode === 1 || (Math.abs(e.deltaY) >= 50 && Number.isInteger(e.deltaY));
          const t = e.target as Element;
          if (!notch || e.ctrlKey || e.shiftKey || t.closest(".maplibregl-map")) return;
          const el = scroller(t);
          const max = el.scrollHeight - el.clientHeight;
          const from = targets.get(el) ?? el.scrollTop;
          const to = Math.max(0, Math.min(max, from + e.deltaY * (e.deltaMode === 1 ? 40 : 1)));
          if (to === from && !targets.has(el)) return;
          e.preventDefault();
          targets.set(el, to);
          if (!raf) raf = requestAnimationFrame(glide);
        },
        { passive: false, signal: ac.signal },
      );
      // A scrollbar drag or keyboard scroll must win over a glide in flight.
      addEventListener("keydown", () => targets.clear(), on);
      addEventListener("pointerdown", () => targets.clear(), on);
    }

    if (fine) {
      document.documentElement.classList.add("has-cursor");
      let x = -100, y = -100, rx = x, ry = y, cr = 0;
      const follow = () => {
        rx += (x - rx) * (calm ? 1 : 0.35);
        ry += (y - ry) * (calm ? 1 : 0.35);
        // `translate`, not `transform`: the hover `scale` would multiply a transform's offset.
        ring.current!.style.translate = `${rx}px ${ry}px`;
        cr = Math.abs(x - rx) + Math.abs(y - ry) > 0.3 ? requestAnimationFrame(follow) : 0;
      };
      addEventListener(
        "pointermove",
        (e) => {
          x = e.clientX;
          y = e.clientY;
          dot.current!.style.translate = `${x}px ${y}px`;
          const r = ring.current!;
          r.dataset.hover = String(!!(e.target as Element).closest?.(HOVER));
          document.documentElement.dataset.cursor = "on";
          if (!cr) cr = requestAnimationFrame(follow);
        },
        on,
      );
      addEventListener("pointerdown", () => (ring.current!.dataset.down = "true"), on);
      addEventListener("pointerup", () => (ring.current!.dataset.down = "false"), on);
      addEventListener(
        "pointerout",
        (e) => {
          if (!e.relatedTarget) document.documentElement.dataset.cursor = "off";
        },
        on,
      );
    }

    return () => {
      ac.abort();
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div className="cur-ring" ref={ring} aria-hidden="true" />
      <div className="cur-dot" ref={dot} aria-hidden="true" />
    </>
  );
}
