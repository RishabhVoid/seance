import Link from "next/link";
import { notFound } from "next/navigation";
import { getGhost, GHOSTS } from "@/lib/ghosts";
import { roman } from "@/lib/roman";
import { Sigil } from "@/components/sigil";
import { ScrollDowel } from "@/components/scroll-dowel";
import CommunionSheet from "./communion-sheet";

export const instant = false;

export default async function GhostPage({
  params,
}: {
  params: Promise<{ ghostId: string }>;
}) {
  const { ghostId } = await params;
  const ghost = getGhost(ghostId);
  if (!ghost) notFound();

  const folio = GHOSTS.findIndex((g) => g.id === ghost.id) + 1;

  return (
    <main className="relative flex-1 flex flex-col">
      <ScrollDowel position="top" />

      <article className="paper paper--scroll relative flex-1 flex flex-col w-full px-6 py-12 sm:px-14 md:px-20 lg:px-28">
        <div className="mx-auto flex min-h-full w-full max-w-[760px] flex-1 flex-col">
          {/* running header */}
          <header className="mb-10 flex items-end justify-between">
            <Link href="/" className="rule-link marg">
              ret. to chapel
            </Link>
            <p className="marg">
              folio {roman(folio).toLowerCase()} · {roman(ghost.born)}
            </p>
          </header>

          {/* identification */}
          <div className="mb-10 flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="marg">herein summon&apos;d —</p>
              <h1 className="display mt-1 text-[52px] leading-[0.95] text-[color:var(--ink)]">
                {ghost.name}
              </h1>
              <p className="mt-2 text-[15px] italic leading-snug text-[color:var(--ink-faded)]">
                {ghost.interred}.
              </p>
            </div>
            <div className="mt-1 shrink-0 text-[color:var(--blood)]">
              <Sigil id={ghost.id} size={56} />
            </div>
          </div>

          <hr className="mb-6 border-0 border-t border-[color:var(--ink)]/20" />

          <CommunionSheet ghost={ghost} />
        </div>
      </article>

      <ScrollDowel position="bottom" />
    </main>
  );
}
