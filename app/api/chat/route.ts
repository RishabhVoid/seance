import { NextRequest } from "next/server";
import { getGhost } from "@/lib/ghosts";
import { DEFAULT_MODEL, streamChat, type ChatMessage } from "@/lib/ollama";

type ClientMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const { ghostId, messages } = (await req.json()) as {
    ghostId: string;
    messages: ClientMessage[];
  };

  const ghost = getGhost(ghostId);
  if (!ghost) {
    return new Response(JSON.stringify({ error: "unknown ghost" }), { status: 404 });
  }

  const chat: ChatMessage[] = [
    { role: "system", content: ghost.system },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const piece of streamChat(DEFAULT_MODEL, chat, req.signal)) {
          controller.enqueue(encoder.encode(piece));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "stream failed";
        controller.enqueue(encoder.encode(`\n\n[the connection falters: ${msg}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
