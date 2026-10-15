import { stages } from "@/content/site";

/* Numbered because this genuinely is a sequence — you cannot demo what
   you have not shipped. Each stage is a row on the page grid, not a card. */
export default function Stages() {
  return (
    <ol>
      {stages.map((s) => (
        <li key={s.id} id={s.id} className="rule grid12 py-14 first:border-t-0 md:py-20">
          <div className="md:col-span-4">
            <p className="label tnum">{s.index}</p>
            <h3 className="mt-3 text-h2 text-text">{s.name}</h3>
            <p className="mt-3 measure text-lead text-accent">{s.claim}</p>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <p className="measure text-body text-muted">{s.body}</p>
            <ul className="mt-8">
              {s.rules.map((r) => (
                <li
                  key={r}
                  className="rule flex gap-5 py-3.5 text-small text-text first:border-t-0"
                >
                  <span aria-hidden className="mt-2 h-px w-5 shrink-0 bg-accent-dim" />
                  <span className="measure">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
