export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
export const DEFAULT_MODEL = process.env.OLLAMA_MODEL ?? "gemma4:e4b";

export async function* streamChat(
  model: string,
  messages: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      options: { temperature: 0.85, top_p: 0.9 },
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    const err = await res.text().catch(() => "");
    throw new Error(`ollama ${res.status}: ${err || res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      try {
        const chunk = JSON.parse(line) as { message?: { content?: string }; done?: boolean };
        const piece = chunk.message?.content;
        if (piece) yield piece;
        if (chunk.done) return;
      } catch {
        // ignore partial line
      }
    }
  }
}
