import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHead from "@/components/SectionHead";
import KineticBand from "@/components/KineticBand";
import Convergence from "@/components/Convergence";
import ShipRules from "@/components/ShipRules";
import ShipLog from "@/components/ShipLog";
import { FounderFeature } from "@/components/PeopleList";
import Magnetic from "@/components/motion/Magnetic";
import Reveal from "@/components/motion/Reveal";
import { contactEmail, projects, shipPath } from "@/content/site";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Backs up the hero's claim straight away: every school, one room. */}
      <Convergence>
        <SectionHead
          label="Who turns up"
          title="Twelve schools, one room"
          lede="The person who knows the domain and the person who knows the stack end up on the same team. That is where the projects worth building come from."
        />
      </Convergence>

      <KineticBand words={shipPath} />

      {/* Small on purpose: the work itself lives on /projects, where every
          member's project gets the full treatment. */}
      <section className="shell">
        <Link
          href="/projects"
          className="group grid12 items-end rounded-xl border border-line-bright bg-bg-lift/40 px-6 py-10 no-underline transition-colors duration-300 hover:border-accent md:px-10 md:py-12"
        >
          <div className="md:col-span-7">
            <p className="label">Projects</p>
            <h2 className="mt-4 text-h2 text-text">Built by the guild</h2>
            <p className="mt-4 measure text-body text-muted">
              Every project has a public URL you can open right now. When
              yours ships, it goes up here too.
            </p>
          </div>
          <div className="mt-8 md:col-span-4 md:col-start-9 md:mt-0 md:text-right">
            <p className="flex items-center gap-2 font-mono text-meta text-ok md:justify-end">
              <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-ok" />
              Live now
            </p>
            <p className="mt-1 text-[clamp(4rem,9vw,7.5rem)] font-[450] leading-none tracking-[-0.05em] text-text tnum">
              {projects.length}
            </p>
            <p className="mt-3 text-small text-accent transition-transform duration-300 group-hover:translate-x-1">
              Browse projects
            </p>
          </div>
        </Link>
      </section>

      <section className="shell">
        <SectionHead
          label="How we work"
          title="Rules we ship by"
          lede="Four habits, taken from the workshop we run for hackathon teams. They are the difference between a project and a class assignment."
        />
        <ShipRules />
        <p className="mt-10">
          <Link
            href="/workshop"
            className="text-small text-accent no-underline underline-offset-4 hover:underline"
          >
            The full Build. Ship. Demo. workshop
          </Link>
        </p>
      </section>

      <section className="shell">
        <SectionHead
          label="History"
          title="Everything so far"
          lede="Short, because the guild is new. Every line is something that actually happened."
        />
        <ShipLog />
      </section>

      <section className="shell">
        <SectionHead
          label="People"
          title="Started by a builder"
          lede="Graduate students from across Columbia, organised by people who build too."
        />
        <FounderFeature />
      </section>

      {/* The last thing on the page is the only thing the page wants. */}
      <section className="shell">
        <div className="rule-bright mt-20 pt-14">
          <Reveal
            as="h2"
            split="chars"
            className="max-w-[14ch] text-[clamp(3rem,9vw,8.5rem)] font-[450] leading-[0.9] tracking-[-0.05em] text-text"
          >
            Ship something this semester.
          </Reveal>
          <div className="grid12 mt-12 items-end">
            <p className="measure text-lead text-muted md:col-span-6">
              Open to every graduate student at Columbia, whatever you studied
              before. Bring an idea, or join a team that has one.
            </p>
            <div className="flex flex-wrap gap-3 md:col-span-5 md:col-start-8 md:justify-end">
              <Magnetic strength={0.5}>
                <Link
                  href="/join"
                  className="block rounded-full bg-accent px-7 py-3.5 text-body font-medium text-accent-ink no-underline transition-colors hover:bg-accent-hi"
                >
                  Start building
                </Link>
              </Magnetic>
              <Magnetic>
                <a
                  href={`mailto:${contactEmail}`}
                  className="block rounded-full border border-line-bright px-7 py-3.5 text-body text-text no-underline transition-colors hover:border-accent hover:text-accent"
                >
                  Ask a question
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
