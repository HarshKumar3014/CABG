"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, queueRefresh } from "@/lib/gsap";
import { canAnimate } from "@/lib/motion-safety";
import type { Project } from "@/content/site";

/* Measures whether the deployed site answers right now. A no-cors
   request cannot read the response, but it only resolves if the host
   answered — which is exactly the claim a "live" badge makes. */
function usePing(url: string) {
  const [state, setState] = useState<
    { status: "checking" } | { status: "up"; ms: number } | { status: "down" }
  >({ status: "checking" });

  useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();
    const timeout = window.setTimeout(() => ctrl.abort(), 8000);
    const t0 = performance.now();

    fetch(url, { mode: "no-cors", cache: "no-store", signal: ctrl.signal })
      .then(() => {
        if (alive) setState({ status: "up", ms: Math.round(performance.now() - t0) });
      })
      .catch(() => {
        if (alive) setState({ status: "down" });
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      alive = false;
      ctrl.abort();
    };
  }, [url]);

  return state;
}

function BrowserFrame({ project }: { project: Project }) {
  const [live, setLive] = useState(false);
  const ping = usePing(project.url);
  const frame = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);

  // tilt toward the pointer; flattens while the embed is being used
  useEffect(() => {
    const el = frame.current;
    const g = glare.current;
    if (!el || !g || !canAnimate()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const rx = gsap.quickTo(el, "rotateX", { duration: 0.8, ease: "power3" });
    const ry = gsap.quickTo(el, "rotateY", { duration: 0.8, ease: "power3" });
    gsap.set(el, { transformPerspective: 1600 });

    const move = (e: PointerEvent) => {
      if (live) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(-py * 7);
      ry(px * 9);
      gsap.to(g, {
        opacity: 0.55,
        background: `radial-gradient(600px circle at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, rgba(155,203,235,0.16), transparent 45%)`,
        duration: 0.3,
      });
    };
    const leave = () => {
      rx(0);
      ry(0);
      gsap.to(g, { opacity: 0, duration: 0.5 });
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [live]);

  useEffect(() => {
    if (live && frame.current) gsap.to(frame.current, { rotateX: 0, rotateY: 0, duration: 0.5 });
  }, [live]);

  return (
    <div
      ref={frame}
      data-cursor
      className="relative overflow-hidden rounded-xl border border-line-bright bg-bg-lift shadow-[0_60px_160px_-50px_rgba(155,203,235,0.3)] will-change-transform"
    >
      {/* chrome */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-line-bright" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-bright" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-bright" />
        </div>
        <div className="mx-auto flex min-w-0 max-w-md flex-1 items-center gap-2 rounded-md bg-bg px-3 py-1.5">
          <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden className="shrink-0 text-muted-dim">
            <rect x="1" y="5" width="8" height="6" rx="1" fill="currentColor" />
            <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" fill="none" strokeWidth="1.2" />
          </svg>
          <span className="truncate font-mono text-meta text-muted">{project.host}</span>
        </div>
        <span
          className={
            "flex shrink-0 items-center gap-2 font-mono text-meta " +
            (ping.status === "up" ? "text-ok" : ping.status === "down" ? "text-muted-dim" : "text-muted")
          }
        >
          <span
            className={
              "inline-block h-1.5 w-1.5 rounded-full " +
              (ping.status === "up" ? "live-dot bg-ok" : "bg-muted-dim")
            }
          />
          {ping.status === "up"
            ? `Live · ${ping.ms} ms`
            : ping.status === "down"
              ? "Unreachable"
              : "Checking"}
        </span>
      </div>

      {/* viewport */}
      <div className="relative aspect-[16/9.4] bg-bg">
        {live ? (
          <iframe
            src={project.url}
            title={`${project.name}, running live`}
            className="absolute inset-0 h-full w-full"
            sandbox="allow-scripts allow-same-origin allow-popups"
            loading="lazy"
          />
        ) : (
          <>
            <Image
              src={project.cover}
              alt={`${project.name} home page`}
              fill
              sizes="(min-width: 48rem) 60vw, 100vw"
              className="object-cover object-top"
              priority={false}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/70 to-transparent" />
            <button
              type="button"
              onClick={() => setLive(true)}
              className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-small font-medium text-accent-ink transition-colors hover:bg-accent-hi"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent-ink" />
              Run it here
            </button>
          </>
        )}
        <div ref={glare} aria-hidden className="pointer-events-none absolute inset-0 opacity-0" />
      </div>
    </div>
  );
}

/* The flagship treatment: the actual deployed thing, framed, pingable,
   and runnable in place. Rises into view like a camera settling on it. */
export default function ProjectShowcase({
  project,
  headingLevel = "h3",
}: {
  project: Project;
  headingLevel?: "h2" | "h3";
}) {
  const root = useRef<HTMLDivElement>(null);
  const H = headingLevel;

  useEffect(() => {
    const el = root.current;
    if (!el || !canAnimate()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-stage]",
        { rotateX: 24, y: 80, scale: 0.92, transformPerspective: 1400, transformOrigin: "50% 100%" },
        {
          rotateX: 0,
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "top 30%", scrub: 0.6 },
        }
      );
    }, el);
    queueRefresh();
    return () => ctx.revert();
  }, []);

  return (
    <article ref={root} className="grid12 items-start">
      <div data-stage className="md:col-span-8">
        <BrowserFrame project={project} />
      </div>

      <div className="mt-10 md:col-span-4 md:mt-0 md:pl-2">
        <p className="flex items-center gap-2 font-mono text-meta text-ok">
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-ok" />
          Shipped {project.shipped}
        </p>
        <H className="mt-4 text-h2 text-text">{project.name}</H>
        <p className="mt-3 text-lead text-text">{project.tagline}</p>
        <p className="mt-4 text-body text-muted">{project.summary}</p>

        <ul className="mt-6">
          {project.features.map((f) => (
            <li key={f} className="rule flex gap-4 py-2.5 text-small text-text first:border-t-0">
              <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-accent-dim" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-line-bright px-3 py-1 font-mono text-meta text-muted"
            >
              {s}
            </span>
          ))}
        </div>

        <p className="mt-6 text-small text-muted-dim">
          Built by <span className="text-muted">{project.builtBy.join(", ")}</span>
        </p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="text-small text-accent no-underline underline-offset-4 hover:underline"
          >
            Open {project.host}
          </a>
        </div>
      </div>
    </article>
  );
}

/* The honest second tile: there is one project so far, and the next
   one is somebody reading this. */
export function NextSlot() {
  return (
    <Link
      href="/join"
      className="group grid12 items-center rounded-xl border border-dashed border-line-bright px-6 py-10 no-underline transition-colors hover:border-accent md:px-10"
    >
      <div className="md:col-span-7">
        <p className="font-mono text-meta text-muted-dim">Next deploy</p>
        <p className="mt-3 text-h2 text-muted transition-colors group-hover:text-text">
          Your project goes here.
        </p>
      </div>
      <p className="mt-4 measure text-body text-muted-dim md:col-span-4 md:col-start-9 md:mt-0">
        Teams form at the opening workshop and ship by demo day. Bring an idea
        or join someone else&rsquo;s.{" "}
        <span className="text-accent">Start building</span>
      </p>
    </Link>
  );
}
