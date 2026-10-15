"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import ShaderBackdrop from "./ShaderBackdrop";
import ShipTerminal from "./ShipTerminal";
import Magnetic from "./motion/Magnetic";
import { gsap, SplitText, ease, queueRefresh } from "@/lib/gsap";
import { armRevealFailsafe, canAnimate, showNow } from "@/lib/motion-safety";
import { INTRO_DONE, introWillPlay } from "@/lib/intro";
import { heroDeploy, site } from "@/content/site";

/* The opening statement, and beside it the thing it describes: an
   idea going from a push to a live URL. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    armRevealFailsafe();

    if (!canAnimate()) {
      showNow(el.querySelectorAll("[data-hero]"));
      return;
    }

    let ctx: ReturnType<typeof gsap.context> | undefined;
    let cancelled = false;

    const play = () => {
      if (cancelled) return;
      try {
        ctx = gsap.context(() => {
          const heading = el.querySelector<HTMLElement>("[data-hero-heading]");
          const split = heading
            ? new SplitText(heading, { type: "chars,words", mask: "words" })
            : null;

          gsap.set(el.querySelectorAll("[data-hero]"), { autoAlpha: 1 });

          const tl = gsap.timeline({ defaults: { ease: ease.out } });
          tl.from("[data-hero-eyebrow]", { yPercent: 120, duration: 0.7 });
          if (split) {
            tl.from(
              split.chars,
              { yPercent: 120, rotate: 4, duration: 1.1, stagger: 0.028 },
              "-=0.45"
            );
          }
          tl.from("[data-hero-lede]", { y: 24, autoAlpha: 0, duration: 0.9 }, "-=0.7")
            .from(
              "[data-hero-cta]",
              { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.08 },
              "-=0.7"
            )
            .from(
              "[data-hero-term]",
              { y: 60, rotateX: 18, autoAlpha: 0, duration: 1.2, transformPerspective: 1200 },
              "-=1.0"
            );

          // headline drifts slower than the page; terminal slightly faster
          gsap.to("[data-hero-heading]", {
            yPercent: 30,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to("[data-hero-term]", {
            yPercent: -12,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          });
        }, el);
        queueRefresh();
      } catch {
        showNow(el.querySelectorAll("[data-hero]"));
      }
    };

    if (introWillPlay()) {
      window.addEventListener(INTRO_DONE, play, { once: true });
      const t = window.setTimeout(play, 3500);
      return () => {
        cancelled = true;
        window.clearTimeout(t);
        window.removeEventListener(INTRO_DONE, play);
        ctx?.revert();
      };
    }
    play();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={root} className="relative isolate overflow-hidden">
      <ShaderBackdrop className="absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-b from-transparent to-bg"
      />

      <div className="shell flex min-h-[92svh] flex-col justify-center pb-16 pt-28">
        <div className="overflow-hidden">
          <p data-hero data-hero-eyebrow className="label">
            {site.name}
          </p>
        </div>

        <h1
          data-hero
          data-hero-heading
          className="mt-5 text-[clamp(3.5rem,12vw,11rem)] font-[450] leading-[0.86] tracking-[-0.055em] text-text"
        >
          {site.thesis}
        </h1>

        <div className="grid12 mt-12 items-end md:mt-16">
          <div className="md:col-span-5">
            <p data-hero data-hero-lede className="measure text-lead text-muted">
              Graduate students from every school at Columbia, learning AI the
              only way that sticks — by building something real and putting it
              in front of people.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <Link
                  data-hero
                  data-hero-cta
                  href="/join"
                  className="block rounded-full bg-accent px-5 py-2.5 text-small font-medium text-accent-ink no-underline transition-colors hover:bg-accent-hi"
                >
                  Start building
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  data-hero
                  data-hero-cta
                  href="/projects"
                  className="block rounded-full border border-line-bright px-5 py-2.5 text-small text-text no-underline transition-colors hover:border-accent hover:text-accent"
                >
                  See what we shipped
                </Link>
              </Magnetic>
            </div>
          </div>

          <div data-hero data-hero-term className="md:col-span-6 md:col-start-7">
            <ShipTerminal project={heroDeploy} />
          </div>
        </div>
      </div>
    </section>
  );
}
