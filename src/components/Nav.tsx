"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { cn } from "@/lib/utils";

export default function Nav() {
  const pathname = usePathname();
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    const id = requestAnimationFrame(onScroll);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        lifted ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"
      )}
    >
      <div className="shell flex h-16 items-center gap-8">
        <Link href="/" className="group flex items-center gap-2.5 no-underline">
          <span aria-hidden className="text-[1.15rem] leading-none">
            {site.mark}
          </span>
          <span className="font-mono text-small font-medium tracking-[0.04em] text-text">
            {site.short}
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-small no-underline transition-colors",
                  active ? "text-text" : "text-muted hover:text-text"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/join"
            className="text-small text-accent no-underline transition-colors hover:text-text"
          >
            Join
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-1 ml-auto grid h-9 w-9 place-items-center text-muted md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d={open ? "M4 4l10 10M14 4L4 14" : "M2 5h14M2 13h14"}
              stroke="currentColor"
              strokeWidth="1.25"
              fill="none"
            />
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="shell border-t border-line py-2 md:hidden">
          {[...nav, { label: "Join", href: "/join" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line py-3.5 text-body text-muted no-underline last:border-0 hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
