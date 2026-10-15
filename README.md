# Columbia Applied Builders Guild

Site for CABG. Next.js 16 (App Router), TypeScript, Tailwind v4, WebGL hero via ogl.

```bash
npm run dev     # http://localhost:3000
npm run build
```

## Editing content

Everything you will want to change lives in **`src/content/site.ts`**. Club details,
navigation, the method, the program formats, events, and people are all there.
No other file needs to be touched to update copy.

Anything still marked `TODO` needs a real value before launch:

- `site.domain`
- `site.socials` — delete any account the club does not actually run
- `events[].when` — exact dates for DivHacks and the Sheep Meadow meetup
- `founder.program` — department and degree
- `formats[].cadence` — guesses until the term plan is set

## Privacy

`people` holds names only. Do not add phone numbers to this file or anywhere
else in the repo — it is public once deployed. **Get each person's permission
before their name goes live.** The remaining founding members are deliberately
left as `placeholder: true` role slots for that reason — fill each one in as
its person confirms.

## Structure

The site leads with shipping. The hero types a real deploy of a real
project ending on its live URL (`ShipTerminal`); `/projects` frames each
project in a browser window with a live reachability check and a
"Run it here" button that embeds the actual deployed site.

Adding a project: put a screenshot in `public/projects/`, add an entry to
`projects` in `site.ts`, and add a `ship` line to `shipLog`. The first
project is the one the hero terminal deploys. A project can only be
embedded if its host does not send `X-Frame-Options` / `frame-ancestors`
— check with `curl -sI <url>` before adding it.

The "Live · N ms" badge is measured in the visitor's browser on each load,
never written by hand. Keep it that way; it is the one claim on the page a
visitor can check.

The site is organised around the guild's goal — making advanced AI practical,
collaborative and accessible across technical and non-technical backgrounds.
Two pieces carry that argument:

- **`Convergence`** draws it: twelve Columbia schools, lines converging on one
  room, scrubbed by scroll. Edit `disciplines` in `site.ts`.
- **`LevelPicker`** proves it. The reader says how much they have done before
  and the page answers with the session they should actually turn up to. Edit
  `levels`; the same data drives the filter on `/program`.

**Build. Ship. Demo.** is a workshop the guild wrote for DivHacks, not the
club's identity. It lives in `workshop` and `stages`, gets a three-line
summary on the home page, and has its own `/workshop` page for the full
scrubbed walkthrough.

## Motion

`src/components/motion/` holds the motion system. Lenis provides weighted
smooth scroll, driven off GSAP's ticker so ScrollTrigger and Lenis always
agree about where the page is. One easing vocabulary lives in
`src/lib/gsap.ts`; use it rather than introducing new curves.

`MethodScroll` presents the workshop: the viewport is held with CSS
`position: sticky` while a scrubbed GSAP timeline advances build → ship →
demo through it. Each stage holds for three quarters of its scroll and
swaps in the last quarter, so a stage is readable rather than permanently
mid-transition.

### The rule that matters

**Animation may only hide content when it can also be relied on to show it
again.** A background tab stops firing rAF, so GSAP's ticker freezes and
anything mid-entrance stays invisible. `src/lib/motion-safety.ts` enforces
this: `canAnimate()` is checked before anything is hidden, and a failsafe
shows any element that is past its own trigger line and still hidden.
The CSS that hides reveal targets is scoped to `.js`, so a page with no
JavaScript is plain and fully readable.

Corollary: never put a CSS `transition` on a property GSAP animates.

### Scroll

Two things keep the scroll honest, and both are easy to undo by accident:

- **Smoothing stays light** (`lerp: 0.14`). A long duration ease looks good in
  a screen recording and feels broken under the hand, because the page keeps
  moving after the wheel has stopped.
- **One refresh, not ten.** Use `queueRefresh()` from `src/lib/gsap.ts` rather
  than calling `ScrollTrigger.refresh()` directly. Every component that set up
  a trigger used to refresh on mount, which recalculated every trigger on the
  page once per component and showed up as a hitch.

Keep the home page near six viewports. It reached nine once, and most of the
excess was a single pinned section that read as a page that had stopped
scrolling. Long pinned sequences belong on their own page.

If a Tailwind utility appears in the DOM but has no effect, the dev server's
class scan has gone stale on a newly added file. Restart it.

## Design tokens

Colors, type scale, and spacing are CSS custom properties at the top of
`src/app/globals.css`. `--accent` is Columbia Blue; change it there and every
link, button, and focus ring follows.

## Deploying

Push to GitHub, import the repo at vercel.com, accept the defaults. Every pull
request gets its own preview URL.
