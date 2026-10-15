"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ease, queueRefresh } from "@/lib/gsap";
import { canAnimate, showNow } from "@/lib/motion-safety";
import { shipLog } from "@/content/site";

const tag = {
  ship: { label: "ship", cls: "text-ok border-ok/40" },
  event: { label: "event", cls: "text-accent border-accent/40" },
  feat: { label: "init", cls: "text-muted border-line-bright" },
} as const;

/* The guild's history as `git log --graph`: newest on top, a rail
   running down the left that draws itself, and a commit per thing that
   actually happened. */
export default function ShipLog() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const rows = el.querySelectorAll<HTMLElement>("[data-commit]");

    if (!canAnimate()) {
      showNow(rows);
      gsap.set(el.querySelector("[data-rail]"), { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-rail]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 70%", scrub: 0.5 },
        }
      );
      rows.forEach((row) => {
        gsap.set(row, { autoAlpha: 1 });
        gsap.from(row.querySelector("[data-dot]"), {
          scale: 0,
          duration: 0.5,
          ease: "back.out(3)",
          scrollTrigger: { trigger: row, start: "top 75%" },
        });
        gsap.from(row.querySelectorAll("[data-line]"), {
          x: -20,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: ease.out,
          scrollTrigger: { trigger: row, start: "top 78%" },
        });
      });
    }, el);
    queueRefresh();
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="relative overflow-hidden rounded-xl border border-line bg-bg-lift/60 px-5 py-8 font-mono md:px-10 md:py-10"
    >
      <p className="text-meta text-muted-dim">
        <span className="text-accent">$</span> git log --graph --oneline guild
      </p>

      <div className="relative mt-8">
        <span
          data-rail
          aria-hidden
          className="absolute bottom-3 left-[5px] top-3 w-px origin-top bg-accent-dim"
        />
        <ol>
          {shipLog.map((c) => {
            const t = tag[c.kind];
            const inner = (
              <>
                <div data-line className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-small text-accent">{c.hash}</span>
                  <span className={`rounded border px-1.5 py-px text-meta ${t.cls}`}>
                    {t.label}
                  </span>
                  <span className="font-sans text-h3 text-text">{c.message}</span>
                </div>
                <p data-line className="mt-2 max-w-[62ch] font-sans text-body text-muted">
                  {c.detail}
                </p>
                <p data-line className="mt-2 text-meta text-muted-dim">
                  {c.when}
                </p>
              </>
            );
            return (
              <li key={c.hash} data-commit className="relative pb-10 pl-9 last:pb-0">
                <span
                  data-dot
                  aria-hidden
                  className={
                    "absolute left-0 top-[0.45rem] h-[11px] w-[11px] rounded-full border-2 " +
                    (c.kind === "ship" ? "border-ok bg-ok" : c.kind === "event" ? "border-accent bg-bg" : "border-line-bright bg-bg")
                  }
                />
                {c.href ? (
                  c.href.startsWith("http") ? (
                    <a href={c.href} target="_blank" rel="noreferrer" className="group block no-underline">
                      {inner}
                    </a>
                  ) : (
                    <Link href={c.href} className="group block no-underline">
                      {inner}
                    </Link>
                  )
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
