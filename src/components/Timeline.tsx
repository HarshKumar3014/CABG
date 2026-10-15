"use client";

import { useEffect, useRef } from "react";
import { gsap, ease, queueRefresh } from "@/lib/gsap";
import { canAnimate, showNow } from "@/lib/motion-safety";
import type { EventItem } from "@/content/site";

/* A spine that draws itself as you read down it, with a node per event.
   The club has two events so far; the line is honest about that rather
   than padding the page out. */
export default function Timeline({ items }: { items: EventItem[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const rows = el.querySelectorAll<HTMLElement>("[data-row]");

    if (!canAnimate()) {
      showNow(rows);
      gsap.set(el.querySelector("[data-spine-fill]"), { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to("[data-spine-fill]", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
          end: "bottom 80%",
          scrub: 0.5,
        },
      });

      rows.forEach((row) => {
        gsap.set(row, { autoAlpha: 1 });

        gsap.from(row.querySelector("[data-node]"), {
          scale: 0,
          transformOrigin: "center",
          duration: 0.6,
          ease: "back.out(2.5)",
          scrollTrigger: { trigger: row, start: "top 72%" },
        });

        gsap.from(row.querySelectorAll("[data-row-item]"), {
          y: 26,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.07,
          ease: ease.out,
          scrollTrigger: { trigger: row, start: "top 78%" },
        });
      });
    }, el);

    queueRefresh();
    return () => ctx.revert();
  }, [items.length]);

  return (
    <div ref={root} className="relative">
      {/* the spine sits in the gutter on desktop, at the edge on phones */}
      <div
        aria-hidden
        className="absolute bottom-0 left-[7px] top-0 w-px bg-line md:left-[calc(25%-1px)]"
      >
        <span
          data-spine-fill
          className="absolute inset-0 block origin-top scale-y-0 bg-accent-dim"
        />
      </div>

      <ol>
        {items.map((e) => (
          <li
            key={e.slug}
            data-row
            className="relative py-8 pl-9 md:grid md:grid-cols-4 md:gap-x-[clamp(1.5rem,3vw,3rem)] md:py-10 md:pl-0"
          >
            <span
              data-node
              aria-hidden
              className={
                "absolute left-0 top-[2.6rem] h-[15px] w-[15px] rounded-full border-2 md:left-[calc(25%-8px)] " +
                (e.status === "upcoming"
                  ? "border-accent bg-accent"
                  : "border-line-bright bg-bg")
              }
            />

            <div data-row-item className="md:pr-10 md:text-right">
              <p className="label tnum">{e.when}</p>
              <p className="mt-1.5 text-small text-muted-dim">{e.place}</p>
            </div>

            <div className="md:col-span-3 md:pl-10">
              <div
                data-row-item
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1"
              >
                <h3 className="text-h2 text-text">{e.title}</h3>
                <span
                  className={
                    e.status === "upcoming" ? "label text-accent" : "label"
                  }
                >
                  {e.status === "upcoming" ? e.kind : `${e.kind} · held`}
                </span>
              </div>

              <p data-row-item className="mt-4 measure text-body text-muted">
                {e.blurb}
              </p>

              {e.detail && (
                <ul className="mt-7">
                  {e.detail.map((d) => (
                    <li
                      key={d}
                      data-row-item
                      className="rule flex gap-5 py-3 text-small text-text first:border-t-0"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-px w-5 shrink-0 bg-accent-dim"
                      />
                      <span className="measure">{d}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
