import type { Metadata } from "next";
import SectionHead from "@/components/SectionHead";
import LevelPicker from "@/components/LevelPicker";
import Magnetic from "@/components/motion/Magnetic";
import { benefits, contactEmail, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Join",
  description: "How to join the Columbia Applied Builders Guild.",
};

export default function JoinPage() {
  return (
    <>
      <section className="shell">
        <SectionHead
          label="Join"
          title="There is no application to pass"
          lede="Open to every graduate student at Columbia. No background you need to have, and no semester you are too late for."
        />
        <LevelPicker />
      </section>

      <section className="shell">
        <SectionHead label="Why bother" title="What you leave with" />
        <ul>
          {benefits.map((b) => (
            <li
              key={b}
              className="rule grid12 items-baseline py-5 first:border-t-0"
            >
              <span
                aria-hidden
                className="mt-3 hidden h-px w-8 bg-accent-dim md:col-span-1 md:block"
              />
              <span className="text-lead text-text md:col-span-10 md:col-start-3">
                {b}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell">
        <div className="rule-bright grid12 mt-24 py-14">
          <div className="md:col-span-7">
            <h2 className="text-balance text-h2 text-text">
              Say hello and turn up.
            </h2>
            <p className="mt-5 measure text-lead text-muted">
              Email us with what you are studying and what you would like to
              build. {site.status}
            </p>
          </div>
          <div className="mt-8 md:col-span-4 md:col-start-9 md:mt-0 md:justify-self-end">
            <Magnetic>
              <a
                href={`mailto:${contactEmail}`}
                className="block rounded-full bg-accent px-5 py-2.5 text-small font-medium text-accent-ink no-underline transition-colors hover:bg-accent-hi"
              >
                {contactEmail}
              </a>
            </Magnetic>
          </div>
        </div>
      </section>
    </>
  );
}
