import { goals } from "@/config/site";

/** Full-bleed lime band of the goals people actually come in with. */
export function GoalsMarquee() {
  const items = [...goals, ...goals]; // duplicated so the loop is seamless

  return (
    <div className="relative flex overflow-hidden bg-lime-400 py-4">
      <div className="flex w-max animate-marquee items-center gap-8 pr-8">
        {items.map((goal, i) => (
          <span
            key={`${goal}-${i}`}
            className="display flex shrink-0 items-center gap-8 text-2xl whitespace-nowrap text-ink-950 sm:text-3xl"
          >
            {goal}
            <span aria-hidden className="text-ink-950/35">
              ✳
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
