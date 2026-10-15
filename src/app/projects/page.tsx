import type { Metadata } from "next";
import SectionHead from "@/components/SectionHead";
import ProjectShowcase, { NextSlot } from "@/components/ProjectShowcase";
import ShipRules from "@/components/ShipRules";
import { projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things guild members have built and put in front of real people.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="shell">
        <SectionHead
          label="Projects"
          title="Shipped, and still running"
          lede="Everything here has a public URL you can open right now. The badge on each one is checked live when this page loads, not written by hand."
        />
        <div className="space-y-28">
          {projects.map((p) => (
            <ProjectShowcase key={p.slug} project={p} headingLevel="h2" />
          ))}
        </div>
        <div className="mt-24">
          <NextSlot />
        </div>
      </section>

      <section className="shell">
        <SectionHead
          label="How"
          title="The rules everything here was shipped by"
        />
        <ShipRules />
      </section>
    </>
  );
}
