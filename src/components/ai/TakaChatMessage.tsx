import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import EagleIcon from "@/components/icons/EagleIcon";
import { AlertCircle, Info, User } from "lucide-react";
import type { TakaChatEntry } from "@/lib/takaMessages";
import { TAKA } from "@/lib/takaMessages";

const markdownClass =
  "prose prose-invert prose-emerald max-w-none prose-sm " +
  "prose-p:my-2 prose-p:leading-relaxed " +
  "prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 " +
  "prose-headings:mt-4 prose-headings:mb-2 prose-headings:text-emerald-300 " +
  "prose-headings:font-bold prose-headings:tracking-tight " +
  "prose-h2:text-base prose-h3:text-sm " +
  "prose-hr:my-4 prose-hr:border-emerald-500/20 " +
  "prose-strong:text-emerald-200 " +
  "prose-th:text-emerald-400 prose-th:uppercase prose-th:text-[10px] prose-th:tracking-wider prose-th:font-bold " +
  "prose-table:my-3 prose-table:border prose-table:border-emerald-500/15 " +
  "prose-td:border prose-td:border-emerald-500/10 prose-td:p-2 prose-td:text-xs " +
  "prose-code:text-emerald-300 prose-code:bg-emerald-500/10 prose-code:px-1 prose-code:rounded prose-code:text-xs " +
  "prose-pre:bg-black/40 prose-pre:border prose-pre:border-emerald-500/20 prose-pre:rounded-lg";

function formatTime(at: Date): string {
  return at.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function labelFor(kind: TakaChatEntry["kind"]): string {
  switch (kind) {
    case "user":
      return TAKA.labels.you;
    case "assistant":
      return TAKA.labels.taka;
    case "system":
      return TAKA.labels.system;
    case "error":
      return TAKA.labels.error;
  }
}

export function TakaChatMessage({ entry }: { entry: TakaChatEntry }) {
  if (entry.kind === "system") {
    return (
      <div className="flex justify-center animate-in fade-in duration-300">
        <div className="max-w-[90%] flex items-start gap-2 px-4 py-3 rounded-lg border border-blue-500/25 bg-blue-950/30 text-blue-200/90">
          <Info size={14} className="shrink-0 mt-0.5 text-blue-400" />
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-blue-400/80 mb-1">
              {labelFor(entry.kind)} · {formatTime(entry.at)}
            </p>
            <div className={markdownClass}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.text}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (entry.kind === "error") {
    return (
      <div className="flex justify-center animate-in fade-in duration-300">
        <div className="max-w-[90%] flex items-start gap-2 px-4 py-3 rounded-lg border border-red-500/30 bg-red-950/30 text-red-200">
          <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-400" />
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-red-400/80 mb-1">
              {labelFor(entry.kind)} · {formatTime(entry.at)}
            </p>
            <p className="text-sm leading-relaxed">{entry.text}</p>
          </div>
        </div>
      </div>
    );
  }

  const isUser = entry.kind === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`max-w-[88%] min-w-0 rounded-2xl border px-5 py-4 ${
          isUser
            ? "bg-slate-900/80 border-slate-600/50 text-slate-200 rounded-tr-sm"
            : "bg-emerald-950/35 border-emerald-500/25 text-emerald-100/95 rounded-tl-sm border-l-[3px] border-l-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.06)]"
        }`}
      >
        <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-white/5">
          {isUser ? (
            <User size={12} className="text-slate-400" />
          ) : (
            <EagleIcon size={12} className="text-red-400" />
          )}
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
            {labelFor(entry.kind)}
          </span>
          <span className="text-[9px] text-slate-600 ml-auto tabular-nums">{formatTime(entry.at)}</span>
        </div>

        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.text}</p>
        ) : (
          <div className={markdownClass}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export function TakaThinking() {
  return (
    <div className="flex justify-start animate-in fade-in">
      <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-950/25 border border-emerald-500/20 border-l-[3px] border-l-emerald-500">
        <EagleIcon size={14} className="text-red-400 animate-pulse" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-emerald-400/90">{TAKA.loading}</span>
          <span className="text-[9px] uppercase tracking-widest text-emerald-700">{TAKA.labels.taka}</span>
        </div>
      </div>
    </div>
  );
}
