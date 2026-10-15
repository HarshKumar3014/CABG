import Reveal from "./motion/Reveal";

export default function SectionHead({
  label,
  title,
  lede,
}: {
  label: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="grid12 pb-8 pt-16 md:pb-10 md:pt-24">
      <p className="label md:col-span-3">{label}</p>
      <div className="md:col-span-8 md:col-start-5">
        <Reveal as="h2" className="text-balance text-h2 text-text">
          {title}
        </Reveal>
        {lede && (
          <Reveal as="p" className="mt-5 measure text-lead text-muted" delay={0.08}>
            {lede}
          </Reveal>
        )}
      </div>
    </div>
  );
}
