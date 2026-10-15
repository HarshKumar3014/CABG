"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ease, queueRefresh } from "@/lib/gsap";
import { stages } from "@/content/site";

/* The scroll becomes a camera move: the viewport holds still while the
   method advances through it, one stage at a time. Desktop with motion
   only — everyone else gets the plain stacked version (see
   .method-scroll in globals.css), which is better on a small screen
   than a hijacked one. */
const METHOD_QUERY =
  "(min-width: 48rem) and (prefers-reduced-motion: no-preference)";

export default function MethodScroll() {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    /* Same query as the CSS that swaps this in for the stacked list, so
       the two can never disagree — including when a window is resized
       across the breakpoint after load. */
    const mm = gsap.matchMedia(el);
    mm.add(METHOD_QUERY, () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");

      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(panels[0], { autoAlpha: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          onUpdate: (self) => {
            const i = Math.min(
              stages.length - 1,
              Math.floor(self.progress * stages.length)
            );
            setActive(i);
          },
        },
      });

      /* Each stage gets a unit of scroll. The swap happens in the last
         quarter of it, so a stage is readable for most of the time it
         owns rather than permanently mid-transition. */
      panels.forEach((panel, i) => {
        if (i === 0) return;
        const prev = panels[i - 1];
        const out = i - 0.25;

        tl.to(
          prev.querySelectorAll("[data-kinetic]"),
          { yPercent: -110, duration: 0.25, stagger: 0.03, ease: ease.inOut },
          out
        )
          .to(
            prev.querySelectorAll("[data-fade]"),
            { autoAlpha: 0, y: -14, duration: 0.2, stagger: 0.02 },
            out
          )
          .set(prev, { autoAlpha: 0 }, i)

          // incoming arrives from below on the same curve
          .set(panel, { autoAlpha: 1 }, i)
          .fromTo(
            panel.querySelectorAll("[data-kinetic]"),
            { yPercent: 110 },
            { yPercent: 0, duration: 0.25, stagger: 0.03, ease: ease.inOut },
            i
          )
          .fromTo(
            panel.querySelectorAll("[data-fade]"),
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.03 },
            i + 0.02
          );
      });

      // hold the last stage for its full share of the scroll
      tl.to({}, { duration: 0.75 }, stages.length - 0.25);

      // the rail fills across the whole section
      gsap.to("[data-rail-fill]", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // ghost numeral drifts, giving the pinned frame some depth
      gsap.to("[data-ghost]", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      queueRefresh();
      return () => setActive(0);
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={wrap}
      className="method-scroll relative"
      style={{ height: `${stages.length * 78}svh` }}
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        {/* ghost numeral of the current stage */}
        <span
          data-ghost
          aria-hidden
          className="pointer-events-none absolute -right-6 bottom-[-6vh] select-none font-mono text-[34vw] leading-none text-line/70"
        >
          {stages[active].index}
        </span>

        <div className="shell relative w-full">
          <div className="grid12 items-center">
            {/* rail */}
            <div className="col-span-1 flex h-[42svh] items-stretch gap-5">
              <div className="relative w-px bg-line">
                <span
                  data-rail-fill
                  className="absolute inset-0 block origin-top scale-y-0 bg-accent"
                />
              </div>
              <ol className="flex flex-col justify-between">
                {stages.map((s, i) => (
                  <li
                    key={s.id}
                    className={
                      i === active
                        ? "label tnum text-accent transition-colors duration-500"
                        : "label tnum transition-colors duration-500"
                    }
                  >
                    {s.index}
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative col-span-10 col-start-3 h-[52svh]">
              {stages.map((s) => (
                <div
                  key={s.id}
                  data-panel
                  className="absolute inset-0 grid12 content-center"
                >
                  <div className="col-span-5">
                    <div className="overflow-hidden">
                      <h3
                        data-kinetic
                        className="text-[clamp(3rem,11vw,9rem)] leading-[0.85] tracking-[-0.05em] text-text"
                      >
                        {s.name}
                      </h3>
                    </div>
                    <div className="mt-4 overflow-hidden">
                      <p data-kinetic className="text-lead text-accent">
                        {s.claim}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-6 col-start-7">
                    <p data-fade className="measure text-body text-muted">
                      {s.body}
                    </p>
                    <ul className="mt-8">
                      {s.rules.map((r) => (
                        <li
                          key={r}
                          data-fade
                          className="rule flex gap-5 py-3.5 text-small text-text first:border-t-0"
                        >
                          <span
                            aria-hidden
                            className="mt-2 h-px w-5 shrink-0 bg-accent-dim"
                          />
                          <span className="measure">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
