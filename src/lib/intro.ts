export const INTRO_KEY = "cabg:intro";
export const INTRO_DONE = "cabg:intro-done";

/* Both the intro and the hero ask this on mount, before the intro has
   written anything, so they always get the same answer and the hero
   knows whether to wait its turn. */
export function introWillPlay() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return !sessionStorage.getItem(INTRO_KEY);
  } catch {
    return true;
  }
}
