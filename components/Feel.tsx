"use client";

import { useEffect, useRef } from "react";

const HOVER = "a,button,summary,label,select,[role=tab]";

export default function Feel() {
  const axe = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const ac = new AbortController();
    const on = { signal: ac.signal };
    root.classList.add("has-cursor");

    addEventListener(
      "pointermove",
      (e) => {
        const el = axe.current!;
        el.style.translate = `${e.clientX}px ${e.clientY}px`;
        el.dataset.hover = String(!!(e.target as Element).closest?.(HOVER));
        root.dataset.cursor = "on";
      },
      on,
    );
    addEventListener(
      "pointerdown",
      (e) => {
        axe.current!.dataset.down = "true";
        if (calm) return;
        const chips = document.createElement("div");
        chips.className = "chips";
        chips.style.translate = `${e.clientX}px ${e.clientY}px`;
        chips.innerHTML = "<i></i>".repeat(6);
        chips.addEventListener("animationend", () => chips.remove(), { once: true });
        document.body.append(chips);
      },
      on,
    );
    addEventListener("pointerup", () => (axe.current!.dataset.down = "false"), on);
    addEventListener(
      "pointerout",
      (e) => {
        if (!e.relatedTarget) root.dataset.cursor = "off";
      },
      on,
    );

    return () => {
      ac.abort();
      root.classList.remove("has-cursor");
    };
  }, []);

  // The pick tip at (3, 10.5) is the hotspot; the swing pivots on the grip.
  return (
    <div className="cur" ref={axe} aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g stroke="#06090A" strokeWidth="5">
          <path d="M15.5 6 25 29.5" />
          <path d="M3 10.5C6.5 7 10.5 5.2 15.5 5.2L22 4.6" />
        </g>
        <path d="M15.5 6 25 29.5" stroke="#C9D3D8" strokeWidth="2.6" />
        <path d="M21.6 21 25 29.5" stroke="#FF5A45" strokeWidth="3" />
        <path d="M3 10.5C6.5 7 10.5 5.2 15.5 5.2L22 4.6" stroke="#EAF0F2" strokeWidth="2.6" />
        <path d="M19.8 2.7 25.5 2.2 25.8 6.6 20.2 7Z" fill="#EAF0F2" stroke="#06090A" strokeWidth="1.4" />
      </svg>
    </div>
  );
}
