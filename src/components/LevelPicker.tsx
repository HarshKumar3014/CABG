"use client";

import { useRef, useState } from "react";
import { useEffect } from "react";
import { gsap, ease } from "@/lib/gsap";
import { canAnimate } from "@/lib/motion-safety";
import { levels } from "@/content/site";

/* The mission promises the club is reachable from a non-technical
   start. Rather than assert that, let the reader say where they are
   and answer with the actual first session they should turn up to. */
export default function LevelPicker() {
  const [active, setActive] = useState(1);
  const panel = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // slide the marker to the selected stop
  useEffect(() => {
    const t = track.current;
    const m = marker.current;
    if (!t || !m) return;

    const stop = t.querySelectorAll<HTMLElement>("[data-stop]")[active];
    if (!stop) return;

    const x = stop.offsetLeft;
    const w = stop.offsetWidth;

    if (first.current || !canAnimate()) {
      gsap.set(m, { x, width: w });
      first.current = false;
      return;
    }
    gsap.to(m, { x, width: w, duration: 0.6, ease: ease.out });
  }, [active]);

  // swap the answer with the same kinetic language as the rest of the site
  useEffect(() => {
    const el = panel.current;
    if (!el || !canAnimate()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-answer]",
        { yPercent: 40, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.55,
          stagger: 0.05,
          ease: ease.out,
        }
      );
    }, el);
    return () => ctx.revert();
  }, [active]);

  const level = levels[active];

  return (
    <div className="grid12 items-start">
      <div
        ref={track}
        role="radiogroup"
        aria-label="How much have you done before?"
        className="relative flex flex-wrap gap-2 md:col-span-12"
      >
        <span
          ref={marker}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-full rounded-full bg-accent"
        />
        {levels.map((l, i) => (
          <button
            key={l.id}
            data-stop
            type="button"
            role="radio"
            aria-checked={i === active}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                setActive((v) => (v + 1) % levels.length);
              }
              if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                setActive((v) => (v - 1 + levels.length) % levels.length);
              }
            }}
            tabIndex={i === active ? 0 : -1}
            className={
              "relative z-10 rounded-full border px-4 py-2 text-small transition-colors " +
              (i === active
                ? "border-transparent text-accent-ink"
                : "border-line-bright text-muted hover:border-accent hover:text-text")
            }
          >
            {l.label}
          </button>
        ))}
      </div>

      <div ref={panel} className="mt-10 md:col-span-7 md:mt-14">
        <p data-answer className="text-h3 text-muted-dim">
          &ldquo;{level.self}&rdquo;
        </p>
        <p data-answer className="mt-6 text-h2 text-text">
          {level.start}
        </p>
        <p data-answer className="mt-5 measure text-body text-muted">
          {level.first}
        </p>
      </div>

      <div className="mt-8 md:col-span-4 md:col-start-9 md:mt-14">
        <p className="label">Where you would turn up</p>
        <ul className="mt-4">
          {level.formats.map((f) => (
            <li
              key={f}
              data-answer
              className="rule flex items-baseline gap-4 py-3 text-small text-text first:border-t-0"
            >
              <span aria-hidden className="h-px w-4 shrink-0 bg-accent-dim" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
