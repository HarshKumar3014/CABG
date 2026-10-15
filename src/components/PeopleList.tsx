import Image from "next/image";
import Link from "next/link";
import { founder, people, site, type Person } from "@/content/site";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
}

/* A round face, or the person's initials when there is no photo. */
function Avatar({ person, size }: { person: Person; size: number }) {
  if (person.photo) {
    return (
      <Image
        src={person.photo}
        alt=""
        width={size}
        height={size}
        sizes={`${size}px`}
        className="aspect-square shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full border border-line-bright bg-bg-lift font-[450] tracking-[-0.06em] text-muted transition-colors duration-300 group-hover:border-accent-dim group-hover:text-text"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initialsOf(person.name)}
    </span>
  );
}

/* A portrait card. Without a photo the tile carries the club's mark and
   the person's initials rather than a grey silhouette. */
function Portrait({ person, big = false }: { person: Person; big?: boolean }) {
  if (person.photo) {
    return (
      <Image
        src={person.photo}
        alt={person.name}
        width={549}
        height={552}
        sizes={big ? "(min-width: 48rem) 36vw, 100vw" : "(min-width: 48rem) 22vw, 50vw"}
        className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="relative grid aspect-[4/5] w-full place-items-center overflow-hidden bg-bg-lift"
    >
      <span
        className={
          "select-none font-[450] tracking-[-0.06em] text-line-bright transition-colors duration-500 group-hover:text-accent-dim " +
          (big ? "text-[clamp(6rem,16vw,14rem)]" : "text-[clamp(3rem,7vw,5.5rem)]")
        }
      >
        {initialsOf(person.name)}
      </span>
      <span className="absolute bottom-4 right-4 text-2xl">{site.mark}</span>
    </div>
  );
}

function Links({ p }: { p: Person }) {
  if (!p.links?.length && !p.coffee) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
      {p.coffee && (
        <a
          href={`mailto:${p.coffee}`}
          className="text-small text-text no-underline underline-offset-4 hover:text-accent hover:underline"
        >
          Coffee chat
        </a>
      )}
      {p.links?.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className="text-small text-text no-underline underline-offset-4 hover:text-accent hover:underline"
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

/* Home page: the founder, and the way through to everyone else. */
export function FounderFeature() {
  const p = founder;
  return (
    <article className="group grid12 items-center">
      <div className="md:col-span-3">
        <Avatar person={p} size={176} />
      </div>
      <div className="md:col-span-6">
        <p className="font-mono text-meta text-accent">{p.role}</p>
        <h3 className="mt-3 text-[clamp(2.5rem,5vw,4.5rem)] font-[450] leading-[0.95] tracking-[-0.045em] text-text">
          {p.name}
        </h3>
        {p.program && <p className="mt-3 text-small text-muted-dim">{p.program}</p>}
        {p.bio && <p className="mt-5 measure text-lead text-muted">{p.bio}</p>}
      </div>
      <div className="md:col-span-3 md:text-right">
        <Link
          href="/people"
          className="inline-flex items-center gap-2 rounded-full border border-line-bright px-5 py-2.5 text-small text-text no-underline transition-colors hover:border-accent hover:text-accent"
        >
          Our team
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

/* People page: the founder given real weight, then everyone as cards. */
export function TeamCards() {
  const team = people.filter((p) => p.id !== founder.id);
  return (
    <div>
      <article className="group grid12 items-end">
        <div className="overflow-hidden border border-line md:col-span-5">
          <Portrait person={founder} big />
        </div>
        <div className="mt-8 md:col-span-6 md:col-start-7 md:mt-0">
          <p className="font-mono text-meta text-accent">{founder.role}</p>
          <h3 className="mt-3 text-[clamp(2.75rem,6vw,5.5rem)] font-[450] leading-[0.92] tracking-[-0.045em] text-text">
            {founder.name}
          </h3>
          {founder.program && (
            <p className="mt-3 text-small text-muted-dim">{founder.program}</p>
          )}
          {founder.bio && <p className="mt-6 measure text-lead text-muted">{founder.bio}</p>}
          <Links p={founder} />
        </div>
      </article>

      <ul className="mt-20 grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((p) => (
          <li key={p.id} className="group">
            <div className="overflow-hidden border border-line">
              <Portrait person={p} />
            </div>
            <h3 className="mt-5 text-h3 text-text">{p.name}</h3>
            <p className="mt-1 font-mono text-meta text-accent">{p.role}</p>
            {p.program && <p className="mt-1 text-small text-muted-dim">{p.program}</p>}
            <Links p={p} />
          </li>
        ))}
      </ul>

      <p className="mt-12 font-mono text-meta text-muted-dim">
        {people.length} people · graduate students across Columbia
      </p>
    </div>
  );
}
