import type { Metadata } from "next";
import SectionHead from "@/components/SectionHead";
import Timeline from "@/components/Timeline";
import { events } from "@/content/site";

export const metadata: Metadata = {
  title: "Events",
  description: "Workshops, labs and meetups run by the guild.",
};

export default function EventsPage() {
  const upcoming = events
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = events
    .filter((e) => e.status === "past")
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="shell">
      <SectionHead
        label="Events"
        title="Everything the guild has run"
        lede={
          upcoming.length
            ? "Open to any Columbia graduate student. Workshops need no registration; labs and hackathons have limited seats."
            : "The next session is being scheduled. Open to any Columbia graduate student when it is — no registration for workshops."
        }
      />
      <Timeline items={[...upcoming, ...past]} />
    </section>
  );
}
