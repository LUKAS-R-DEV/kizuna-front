/** Taka AI — user-facing copy (English). */

export const TAKA = {
  status: {
    online: "Online",
    offline: "Offline",
    contextReady: "Context loaded",
    awaitingContext: "No file attached",
    syncLost: "Sync unavailable",
  },
  empty: {
    title: "Ready for your question",
    hint: "Upload a PDF for report context, or ask Taka about production, inventory, and quality data.",
  },
  system: {
    fileLoaded: (name: string) =>
      `Report **${name}** loaded into context. Ask a question about this document.`,
    fileLoadFailed: "Could not read the file. Check that it is a valid PDF and try again.",
  },
  error: {
    chatFailed: "Could not reach Taka. Check that the AI service is running and try again.",
  },
  loading: "Taka is analyzing your request…",
  labels: {
    you: "You",
    taka: "Taka",
    system: "System",
    error: "Error",
  },
  input: {
    placeholder: "Ask Taka about reports, production, or inventory…",
    attach: "Attach PDF",
    replace: "Replace PDF",
    send: "Send",
  },
} as const;

export type TakaMessageKind = "user" | "assistant" | "system" | "error";

export interface TakaChatEntry {
  id: string;
  kind: TakaMessageKind;
  text: string;
  at: Date;
}

export function createTakaMessage(kind: TakaMessageKind, text: string): TakaChatEntry {
  return { id: crypto.randomUUID(), kind, text, at: new Date() };
}
