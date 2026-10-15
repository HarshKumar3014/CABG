import type { ReactNode } from "react";
import { disciplines } from "@/content/site";

const W = 1200;
const H = 430;
const CX = 600;
const CY = 215;

/* The club's whole argument, drawn: twelve schools, one room. Static on
   purpose — the picture is already whole when it scrolls into view, so
   nobody has to wait on it or scroll past a half-drawn version. */
export default function Convergence({ children }: { children?: ReactNode }) {
  const half = Math.ceil(disciplines.length / 2);
  const left = disciplines.slice(0, half);
  const right = disciplines.slice(half);

  const yFor = (i: number, n: number) => {
    const span = H - 96;
    return 48 + (span / Math.max(n - 1, 1)) * i;
  };

  return (
    <section className="shell">
      {children}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="hidden w-full md:block"
        role="img"
        aria-label={`Students from ${disciplines.join(", ")} working in one room.`}
      >
        {left.map((d, i) => {
          const y = yFor(i, left.length);
          return (
            <g key={d}>
              <path
                d={`M 250 ${y} C 400 ${y} 460 ${CY} ${CX - 22} ${CY}`}
                fill="none"
                stroke="var(--accent-dim)"
                strokeWidth="1"
              />
              <text
                x="232"
                y={y + 5}
                textAnchor="end"
                className="fill-[var(--muted)] font-sans text-[17px]"
              >
                {d}
              </text>
            </g>
          );
        })}

        {right.map((d, i) => {
          const y = yFor(i, right.length);
          return (
            <g key={d}>
              <path
                d={`M 950 ${y} C 800 ${y} 740 ${CY} ${CX + 22} ${CY}`}
                fill="none"
                stroke="var(--accent-dim)"
                strokeWidth="1"
              />
              <text
                x="968"
                y={y + 5}
                textAnchor="start"
                className="fill-[var(--muted)] font-sans text-[17px]"
              >
                {d}
              </text>
            </g>
          );
        })}

        <g>
          <circle cx={CX} cy={CY} r="20" fill="var(--accent)" />
          <circle cx={CX} cy={CY} r="34" fill="none" stroke="var(--accent-dim)" />
        </g>
      </svg>

      {/* Phones get the roster without the geometry. */}
      <ul className="flex flex-wrap gap-2 md:hidden">
        {disciplines.map((d) => (
          <li
            key={d}
            className="rounded-full border border-line-bright px-3 py-1.5 text-small text-muted"
          >
            {d}
          </li>
        ))}
      </ul>
    </section>
  );
}
