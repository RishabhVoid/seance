"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Ghost } from "@/lib/ghosts";
import { Candle } from "@/components/candle";

type Msg = {
  role: "user" | "assistant";
  content: string;
  shown: number; // number of characters currently revealed (for ghost; equals length for user)
};

type Phase = "ritual" | "writing" | "ready" | "error";

const REVEAL_MS = 24; // ms per character for the ghost's typewriter

export default function CommunionSheet({ ghost }: { ghost: Ghost }) {
  const [phase, setPhase] = useState<Phase>("ritual");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Buffers for streaming: full text from server, and a per-character reveal timer.
  const bufferRef = useRef<string>("");
  const revealTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollTargetRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Open the séance: ritual pause, then begin writing.
  useEffect(() => {
    const t = setTimeout(() => void beginSummon(), 2200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopReveal = () => {
    if (revealTimerRef.current) {
      clearInterval(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  };

  const startReveal = useCallback(() => {
    stopReveal();
    revealTimerRef.current = setInterval(() => {
      setMessages((m) => {
        if (m.length === 0) return m;
        const last = m[m.length - 1];
        if (last.role !== "assistant") return m;
        if (last.shown >= last.content.length) {
          // Caught up — keep ticking in case more text arrives.
          return m;
        }
        const next = m.slice(0, -1);
        next.push({ ...last, shown: last.shown + 1 });
        return next;
      });

      // auto-scroll as writing fills the page
      scrollTargetRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, REVEAL_MS);
  }, []);

  const streamFromServer = useCallback(
    async (history: { role: "user" | "assistant"; content: string }[]) => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setErrorMsg(null);
      setPhase("writing");

      // Append empty ghost slot that we'll fill as text streams in.
      setMessages((m) => [...m, { role: "assistant", content: "", shown: 0 }]);
      startReveal();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ghostId: ghost.id, messages: history }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        bufferRef.current = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const piece = decoder.decode(value, { stream: true });
          bufferRef.current += piece;
          setMessages((m) => {
            if (m.length === 0) return m;
            const last = m[m.length - 1];
            if (last.role !== "assistant") return m;
            const next = m.slice(0, -1);
            next.push({ ...last, content: last.content + piece });
            return next;
          });
        }
      } catch (e) {
        const err = e instanceof Error ? e.message : "connection failed";
        if (err !== "AbortError") {
          setErrorMsg(
            `The thread falters. ${err}. The candles yet burn — is Ollama running? \`ollama serve\``,
          );
          setPhase("error");
          stopReveal();
          return;
        }
      }

      // Wait for the reveal to catch up, then mark ready.
      const settle = setInterval(() => {
        setMessages((m) => {
          if (m.length === 0) return m;
          const last = m[m.length - 1];
          if (last.role === "assistant" && last.shown >= last.content.length) {
            clearInterval(settle);
            stopReveal();
            setPhase("ready");
            requestAnimationFrame(() => inputRef.current?.focus());
          }
          return m;
        });
      }, 60);
    },
    [ghost.id, startReveal],
  );

  const beginSummon = useCallback(async () => {
    await streamFromServer([
      {
        role: "user",
        content:
          "(The candles catch. The circle closes. Someone has summoned you. Greet them in your voice, briefly — one or two sentences — and ask what they want.)",
      },
    ]);
  }, [streamFromServer]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || phase === "writing") return;
    setInput("");
    const history = messages.map(({ role, content }) => ({ role, content }));
    const nextVisible: Msg[] = [
      ...messages,
      { role: "user", content: text, shown: text.length },
    ];
    setMessages(nextVisible);
    await streamFromServer([...history, { role: "user", content: text }]);
  };

  // RITUAL PHASE —————————————————————————————————————————
  if (phase === "ritual") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Candle size={56} />
        <p className="marg mt-10 bleed-in">lighting the candles</p>
        <p className="display mt-5 text-[22px] italic text-[color:var(--ink-soft)] rise">
          calling the name of {ghost.name}…
        </p>
      </div>
    );
  }

  // COMMUNION ————————————————————————————————————————————
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-10">
        {messages.map((m, i) =>
          m.role === "assistant" ? (
            <GhostWriting key={i} msg={m} isLast={i === messages.length - 1} />
          ) : (
            <UserQuery key={i} msg={m} />
          ),
        )}
        <div ref={scrollTargetRef} aria-hidden />
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-10 border-t border-[color:var(--ink)]/25 pt-5"
      >
        <div className="flex items-baseline gap-3">
          <span className="marg shrink-0">ask the dead —</span>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e as unknown as React.FormEvent);
              }
            }}
            disabled={phase === "writing" || phase === "error"}
            placeholder={
              phase === "error"
                ? "the thread is severed."
                : phase === "writing"
                  ? "the ghost is writing…"
                  : "whisper your question into the paper…"
            }
            rows={1}
            autoFocus
            className="inkwell max-h-40 min-h-[1.75rem] flex-1 resize-none text-[18px] leading-relaxed disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || phase !== "ready"}
            className="rule-link marg shrink-0 disabled:cursor-not-allowed disabled:opacity-30"
          >
            cast
          </button>
        </div>
        {phase === "writing" && (
          <p className="marg mt-3 italic opacity-70">the planchette moves…</p>
        )}
      </form>

      {errorMsg && (
        <p className="mt-6 border-t border-[color:var(--blood)]/40 pt-4 text-[13px] italic leading-relaxed text-[color:var(--blood)]/85">
          {errorMsg}
        </p>
      )}
    </div>
  );
}

function GhostWriting({ msg, isLast }: { msg: Msg; isLast: boolean }) {
  const visible = msg.content.slice(0, msg.shown);
  const stillRevealing = msg.shown < msg.content.length;
  // Preserve the author's paragraph breaks.
  const paragraphs = visible.split(/\n{2,}/);

  return (
    <div className="drop">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={
            "whitespace-pre-wrap text-[19px] leading-[1.7] text-[color:var(--ink)] " +
            (i === 0 ? "" : "mt-4")
          }
        >
          {p}
          {i === paragraphs.length - 1 && isLast && stillRevealing ? (
            <span className="quill-cursor" />
          ) : null}
        </p>
      ))}
    </div>
  );
}

function UserQuery({ msg }: { msg: Msg }) {
  return (
    <div className="pl-6 border-l border-[color:var(--ink)]/15">
      <p className="marg mb-1">—&nbsp;asked</p>
      <p className="typewriter whitespace-pre-wrap text-[16px] leading-relaxed text-[color:var(--ink-soft)]">
        {msg.content}
      </p>
    </div>
  );
}
