import type { Metadata } from "next";
import SectionHead from "@/components/SectionHead";
import { TeamCards } from "@/components/PeopleList";

export const metadata: Metadata = {
  title: "People",
  description: "The people building the Columbia Applied Builders Guild.",
};

export default function PeoplePage() {
  return (
    <section className="shell">
      <SectionHead
        label="People"
        title="The people who ship"
        lede="Graduate students from across Columbia. Every organiser also builds — nobody here only administers."
      />
      <TeamCards />
    </section>
  );
}
