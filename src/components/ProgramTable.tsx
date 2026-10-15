"use client";

import { useState } from "react";
import { formats, levels } from "@/content/site";
import { cn } from "@/lib/utils";

/* Filtering by level rather than by category, because "which of these
   is for someone like me" is the only question a new member actually
   has. Nothing is hidden — non-matching rows recede instead, so the
   whole programme stays legible. */
export default function ProgramTable() {
  const [level, setLevel] = useState<string | null>(null);

  const chosen = levels.find((l) => l.id === level);
  const matches = (name: string) =>
    !chosen || chosen.formats.includes(name);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 pb-10">
        <button
          type="button"
          onClick={() => setLevel(null)}
          aria-pressed={level === null}
          className={cn(
            "rounded-full border px-4 py-2 text-small transition-colors",
            level === null
              ? "border-accent bg-accent text-accent-ink"
              : "border-line-bright text-muted hover:border-accent hover:text-text"
          )}
        >
          Everything
        </button>
        {levels.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLevel(l.id === level ? null : l.id)}
            aria-pressed={l.id === level}
            className={cn(
              "rounded-full border px-4 py-2 text-small transition-colors",
              l.id === level
                ? "border-accent bg-accent text-accent-ink"
                : "border-line-bright text-muted hover:border-accent hover:text-text"
            )}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="grid12 rule pb-3 pt-4">
        <p className="label hidden md:col-span-4 md:block">Format</p>
        <p className="label hidden md:col-span-2 md:block">Cadence</p>
        <p className="label hidden md:col-span-3 md:block">Who it is for</p>
      </div>

      <ul>
        {formats.map((f) => {
          const on = matches(f.name);
          return (
            <li
              key={f.name}
              className={cn(
                "rule grid12 grid12-tight py-7 transition-opacity duration-500",
                on ? "opacity-100" : "opacity-25"
              )}
            >
              <h2
                className={cn(
                  "text-h3 transition-colors duration-500 md:col-span-4",
                  on && chosen ? "text-accent" : "text-text"
                )}
              >
                {f.name}
              </h2>
              <p className="text-small text-accent md:col-span-2">{f.cadence}</p>
              <p className="text-small text-muted-dim md:col-span-3">
                {f.forWho}
              </p>
              <p className="measure mt-1 text-body text-muted md:col-span-8 md:col-start-5">
                {f.body}
              </p>
            </li>
          );
        })}
      </ul>

      {chosen && (
        <p className="mt-10 measure text-body text-muted">
          {chosen.start} {chosen.first}
        </p>
      )}
    </>
  );
}
