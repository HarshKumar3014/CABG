"use client";

import { useEffect, useRef, useState } from "react";
import { canAnimate } from "@/lib/motion-safety";
import { INTRO_DONE, introWillPlay } from "@/lib/intro";
type Target = { slug: string; host: string };

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string; tone?: "ok" | "accent" | "dim" }
  | { kind: "bar" }
  | { kind: "live"; host: string };

function script(p: Target): Line[] {
  return [
    { kind: "cmd", text: "git push origin main" },
    { kind: "out", text: "To github.com:cabg/" + p.slug + ".git", tone: "dim" },
    { kind: "out", text: "   main -> main", tone: "dim" },
    { kind: "out", text: "▲ Building " + p.slug, tone: "accent" },
    { kind: "bar" },
    { kind: "out", text: "✓ Compiled", tone: "ok" },
    { kind: "out", text: "✓ Static pages generated", tone: "ok" },
    { kind: "out", text: "▲ Deploying to production", tone: "accent" },
    { kind: "live", host: p.host },
  ];
}

/* The hero's argument, performed: an idea goes from a push to a live
   URL in front of the reader. The project is nobody's in particular —
   it is meant to be the reader's — so the URL is a placeholder, shown
   as text and never linked. Numbers are left out for the same reason:
   a made-up build time would be the one false thing on the screen. */
export default function ShipTerminal({ project }: { project: Target }) {
  const lines = script(project);
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState("");
  const [bar, setBar] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const clear = () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };

    const at = (ms: number, fn: () => void) =>
      timers.current.push(window.setTimeout(fn, ms));

    const finish = () => {
      clear();
      setTyped(lines[0].kind === "cmd" ? lines[0].text : "");
      setBar(100);
      setShown(lines.length);
    };

    const run = () => {
      if (!canAnimate()) return finish();

      let t = 350;
      lines.forEach((line, i) => {
        if (line.kind === "cmd") {
          at(t, () => setShown(i + 1));
          for (let c = 1; c <= line.text.length; c++) {
            at(t + c * 42, () => setTyped(line.text.slice(0, c)));
          }
          t += line.text.length * 42 + 420;
        } else if (line.kind === "bar") {
          at(t, () => setShown(i + 1));
          for (let k = 1; k <= 20; k++) at(t + k * 70, () => setBar(k * 5));
          t += 20 * 70 + 200;
        } else {
          at(t, () => setShown(i + 1));
          t += line.kind === "live" ? 0 : 260;
        }
      });
    };

    if (introWillPlay()) {
      const go = () => run();
      window.addEventListener(INTRO_DONE, go, { once: true });
      at(3600, go);
      return () => {
        window.removeEventListener(INTRO_DONE, go);
        clear();
      };
    }
    run();
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.slug]);

  const done = shown >= lines.length;

  return (
    <div
      className="overflow-hidden rounded-xl border border-line-bright bg-bg-lift/90 shadow-[0_40px_120px_-40px_rgba(155,203,235,0.25)] backdrop-blur"
    >
      <p className="sr-only">
        A terminal pushing a project to production until it is live.
      </p>
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line-bright" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-bright" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-bright" />
        <span className="ml-3 font-mono text-meta text-muted-dim">
          ~/guild/{project.slug} — main
        </span>
      </div>

      <div
        aria-hidden
        className="min-h-[19.5rem] px-5 py-4 font-mono text-[0.8rem] leading-[1.75]"
      >
        {lines.slice(0, shown).map((line, i) => {
          if (line.kind === "cmd")
            return (
              <p key={i} className="text-text">
                <span className="text-accent">$ </span>
                {typed}
                {shown === i + 1 && <span className="caret">▍</span>}
              </p>
            );
          if (line.kind === "bar")
            return (
              <div key={i} className="my-1.5 flex items-center gap-3">
                <div className="h-1 flex-1 overflow-hidden rounded bg-line">
                  <div
                    className="h-full bg-accent transition-[width] duration-100"
                    style={{ width: `${bar}%` }}
                  />
                </div>
                <span className="w-9 text-right text-muted-dim tnum">{bar}%</span>
              </div>
            );
          if (line.kind === "live")
            return (
              <p key={i} className="mt-2 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-2 text-ok">
                  <span className="live-dot inline-block h-2 w-2 rounded-full bg-ok" />
                  Ready
                </span>
                <span className="text-text">https://{line.host}</span>
              </p>
            );
          return (
            <p
              key={i}
              className={
                line.tone === "ok"
                  ? "text-ok"
                  : line.tone === "accent"
                    ? "text-accent"
                    : "text-muted-dim"
              }
            >
              {line.text}
            </p>
          );
        })}
        {done && (
          <p className="mt-1 text-text">
            <span className="text-accent">$ </span>
            <span className="caret">▍</span>
          </p>
        )}
      </div>
    </div>
  );
}
