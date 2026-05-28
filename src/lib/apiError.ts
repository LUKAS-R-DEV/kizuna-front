import { translateMessage } from "@/lib/translateMessage";

function extractRawMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  const err = error as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };
  const data = err.response?.data;
  if (typeof data?.message === "string" && data.message.trim()) return data.message;
  if (typeof data?.error === "string" && data.error.trim()) return data.error;
  if (typeof err.message === "string" && err.message.trim() && !err.message.startsWith("Request failed"))
    return err.message;
  return undefined;
}

/** User-facing API error text in English. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  return translateMessage(extractRawMessage(error)) ?? fallback;
}
