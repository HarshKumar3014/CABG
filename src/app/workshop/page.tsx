import type { Metadata } from "next";
import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import Stages from "@/components/Stages";
import MethodScroll from "@/components/MethodScroll";
import Marquee from "@/components/motion/Marquee";
import { tools, workshop } from "@/content/site";

export const metadata: Metadata = {
  title: workshop.name,
  description: workshop.summary,
};

export default function WorkshopPage() {
  return (
    <>
      <section className="shell">
        <SectionHead
          label="Workshop"
          title={workshop.name}
          lede={`${workshop.summary} First run at DivHacks on Sep 26, 2026.`}
        />
      </section>

      {/* Desktop takes the scroll as a camera move; phones, reduced
          motion and no-JS get the same content stacked. */}
      <MethodScroll />
      <section className="method-stages shell">
        <Stages />
      </section>

      <section className="rule mt-16">
        <Marquee items={tools} />
        <div className="rule" />
      </section>

      <section className="shell">
        <div className="grid12 pt-16">
          <p className="label md:col-span-3">Tools covered</p>
          <p className="measure text-lead text-muted md:col-span-8 md:col-start-5">
            One tool per job, and a hard look at where each of them stops.{" "}
            <Link
              href="/events"
              className="text-text no-underline underline-offset-4 hover:text-accent hover:underline"
            >
              Every event the guild has run
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
