"use client";

import { useEffect } from "react";
import { gsap, ease, queueRefresh } from "@/lib/gsap";
import { site, stages } from "@/content/site";
import { INTRO_DONE, INTRO_KEY, introWillPlay } from "@/lib/intro";
import { canAnimate } from "@/lib/motion-safety";

/* Built imperatively rather than rendered. A preloader has no business
   in the React tree: it must not exist in the server HTML (or a failed
   bundle strands the page behind a curtain) and it must not depend on
   hydration timing to decide whether to run. */
export default function Intro() {
  useEffect(() => {
    if (!introWillPlay() || !canAnimate()) return;

    const root = document.createElement("div");
    root.setAttribute("aria-hidden", "true");
    root.className =
      "fixed inset-0 z-[100] flex flex-col justify-between bg-bg px-[var(--gutter)] py-10";
    root.style.clipPath = "inset(0% 0% 0% 0%)";

    root.innerHTML = `
      <div data-meta class="flex items-baseline justify-between">
        <span class="label">${site.school}</span>
        <span data-count class="label tnum">000</span>
      </div>
      <div class="flex items-end gap-5">
        <span data-mark class="text-[clamp(2.5rem,7vw,5rem)] leading-none">${site.mark}</span>
        <div class="overflow-hidden">
          <div class="flex gap-[0.35em] text-[clamp(2rem,7vw,5.5rem)] leading-[0.9] tracking-[-0.04em]">
            ${stages.map((s) => `<span data-word class="block">${s.name}</span>`).join("")}
          </div>
        </div>
      </div>
      <p data-meta class="label">${site.short}</p>
    `;

    document.body.appendChild(root);
    document.documentElement.classList.add("intro-lock");
    // overflow:hidden stops native scroll but not Lenis, which would
    // otherwise move the page behind the curtain on every wheel tick
    window.__lenis?.stop();

    const count = root.querySelector<HTMLElement>("[data-count]");

    const finish = () => {
      document.documentElement.classList.remove("intro-lock");
      window.__lenis?.start();
      document.documentElement.classList.add("intro-done");
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}
      window.dispatchEvent(new Event(INTRO_DONE));
      queueRefresh();
      root.remove();
    };

    let tl: gsap.core.Timeline | undefined;

    try {
      tl = gsap.timeline({ onComplete: finish });

      tl.from(root.querySelector("[data-mark]"), {
        scale: 0.6,
        autoAlpha: 0,
        duration: 0.7,
        ease: ease.out,
      })
        .from(
          root.querySelectorAll("[data-word]"),
          { yPercent: 110, duration: 0.7, stagger: 0.07, ease: ease.out },
          "-=0.4"
        );

      const counter = { v: 0 };
      tl.to(
        counter,
        {
          v: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            if (count)
              count.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        "-=0.5"
      );

      tl.to(root.querySelectorAll("[data-word]"), {
        yPercent: -110,
        duration: 0.6,
        stagger: 0.05,
        ease: ease.inOut,
      })
        .to(root.querySelector("[data-mark]"), { autoAlpha: 0, duration: 0.3 }, "<")
        .to(root.querySelectorAll("[data-meta]"), { autoAlpha: 0, duration: 0.3 }, "<")
        // the curtain lifts from the bottom, handing the page over
        .to(root, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1,
          ease: ease.inOut,
        });
    } catch {
      finish();
      return;
    }

    return () => {
      tl?.kill();
      document.documentElement.classList.remove("intro-lock");
      window.__lenis?.start();
      root.remove();
    };
  }, []);

  return null;
}
