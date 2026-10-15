import type { Metadata } from "next";
import SectionHead from "@/components/SectionHead";
import ProgramTable from "@/components/ProgramTable";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Program",
  description: "The formats the guild runs through the term.",
};

export default function ProgramPage() {
  return (
    <section className="shell">
      <SectionHead
        label="Program"
        title="What runs through the term"
        lede="Six formats on their own cadence. Filter by how much you have done before — nothing here assumes you attended the last one."
      />
      <ProgramTable />

      <div className="grid12 rule-bright mt-20 pt-10">
        <p className="label md:col-span-3">Also</p>
        <p className="measure text-lead text-muted md:col-span-8 md:col-start-5">
          The guild also writes workshops for other people&rsquo;s events.{" "}
          <Link
            href="/workshop"
            className="text-text no-underline underline-offset-4 hover:text-accent hover:underline"
          >
            Build. Ship. Demo.
          </Link>{" "}
          is the one we run for hackathon teams.
        </p>
      </div>
    </section>
  );
}
