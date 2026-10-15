import Link from "next/link";
import { contactEmail, nav, site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="mt-24 rule">
      <div className="shell grid12 py-16">
        <div className="md:col-span-5">
          <p className="flex items-center gap-2.5">
            <span aria-hidden className="text-[1.15rem] leading-none">
              {site.mark}
            </span>
            <span className="font-mono text-small tracking-[0.04em] text-text">
              {site.short}
            </span>
          </p>
          <p className="mt-4 measure text-small text-muted">{site.pitch}</p>
          <p className="mt-3 text-small text-muted-dim">{site.status}</p>
        </div>

        <nav aria-label="Sections" className="md:col-span-3 md:col-start-7">
          <h2 className="label">Sections</h2>
          <ul className="mt-4 space-y-2.5">
            {[...nav, { label: "Join", href: "/join" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-small text-muted no-underline hover:text-text"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3 md:col-start-10">
          <h2 className="label">Get in touch</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a
                href={`mailto:${contactEmail}`}
                className="text-small text-muted no-underline hover:text-text"
              >
                {contactEmail}
              </a>
            </li>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="text-small text-muted no-underline hover:text-text"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell rule flex flex-wrap items-baseline justify-between gap-4 py-6">
        <p className="label">{site.name}</p>
        <p className="label">{site.location}</p>
      </div>
    </footer>
  );
}
