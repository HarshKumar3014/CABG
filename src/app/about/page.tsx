import type { Metadata } from "next";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/motion/Reveal";
import { benefits, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: site.pitch,
};

export default function AboutPage() {
  return (
    <>
      <section className="shell">
        <SectionHead
          label="About"
          title="A place to learn AI by building it"
          lede={site.pitch}
        />
        <div className="grid12">
          <Reveal
            as="p"
            className="measure text-lead text-text md:col-span-7 md:col-start-5"
          >
            {site.goal}
          </Reveal>
        </div>
      </section>

      <section className="shell">
        <SectionHead
          label="Why join"
          title="What you leave with"
        />
        <ul className="grid12">
          <li className="md:col-span-12">
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
          </li>
        </ul>
      </section>

      <section className="shell">
        <div className="rule-bright grid12 mt-24 py-12">
          <p className="label md:col-span-3">Status</p>
          <p className="measure text-lead text-muted md:col-span-8 md:col-start-5">
            {site.status} Recognition would give the guild rooms to meet in,
            funding to run events, and a route to working with faculty, alumni
            and other Columbia organisations.
          </p>
        </div>
      </section>
    </>
  );
}
