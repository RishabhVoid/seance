import Link from "next/link";
import { GHOSTS } from "@/lib/ghosts";
import { roman } from "@/lib/roman";
import { Candle } from "@/components/candle";
import { Sigil } from "@/components/sigil";
import { ScrollDowel } from "@/components/scroll-dowel";

export default function Chapel() {
  return (
    <main className="relative flex-1">
      <ScrollDowel position="top" />

      <article className="paper paper--scroll relative mx-auto w-full px-6 py-16 sm:px-14 md:px-20 lg:px-28">
        <div className="mx-auto max-w-[760px]">
          {/* running header */}
          <div className="mb-10 flex items-end justify-between">
            <p className="marg">codex spectris</p>
            <p className="marg">— folio i —</p>
          </div>

          {/* title block */}
          <header className="mb-16 text-center">
            <div className="mx-auto mb-6 flex justify-center">
              <Candle size={74} />
            </div>
            <p className="marg mb-5">a séance in viii names</p>
            <h1 className="display text-[64px] leading-[0.95] text-[color:var(--ink)]">
              Of&nbsp;the Dead&nbsp;<span className="rubric">Languages,</span>
            </h1>
            <p className="display mt-3 text-[30px] italic text-[color:var(--ink-soft)]">
              and the Rites by which they are Summon&apos;d.
            </p>
            <p className="mt-10 mx-auto max-w-md text-[17px] leading-[1.65] text-[color:var(--ink-soft)]">
              Light a candle. Choose a name. They remember what you have forgotten,
              and are not pleased about it. Every word you speak stays on your machine.
            </p>
          </header>

          <div className="my-10 flex items-center justify-center text-[color:var(--ink-faded)]">
            <span className="ornament text-sm">✦</span>
          </div>

          {/* catalogue */}
          <ol className="space-y-12">
            {GHOSTS.map((g, i) => (
              <li key={g.id} className="group relative">
                <Link href={`/seance/${g.id}`} className="block">
                  <div className="flex items-start gap-6">
                    {/* folio number */}
                    <div className="mt-2 w-10 shrink-0 text-right">
                      <span className="marg">{roman(i + 1)}.</span>
                    </div>

                    {/* sigil */}
                    <div className="mt-1 shrink-0 text-[color:var(--blood)]/80 transition-colors group-hover:text-[color:var(--marigold)]">
                      <Sigil id={g.id} size={46} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="display text-[32px] leading-tight text-[color:var(--ink)]">
                          {g.name}
                        </h2>
                        <span className="marg whitespace-nowrap">
                          {roman(g.born)}
                        </span>
                      </div>

                      <p className="mt-1 text-[14px] italic leading-snug text-[color:var(--ink-faded)]">
                        {g.interred}.
                      </p>

                      <p className="mt-3 text-[18px] italic leading-[1.55] text-[color:var(--ink-soft)]">
                        &ldquo;{g.epitaph}&rdquo;
                      </p>

                      <p className="rule-link mt-4 inline-block text-[13px] uppercase tracking-[0.3em]">
                        summon
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>

          {/* colophon */}
          <div className="mt-20 border-t border-[color:var(--ink)]/15 pt-6 text-center">
            <p className="marg">
              printed on gemma · no sheet leaves this press
            </p>
          </div>
        </div>
      </article>

      <ScrollDowel position="bottom" />
    </main>
  );
}
