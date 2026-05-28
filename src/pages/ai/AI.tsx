import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { aiApi } from "@/lib/api";
import EagleIcon from "@/components/icons/EagleIcon";
import { TakaChatMessage, TakaThinking } from "@/components/ai/TakaChatMessage";
import {
  createTakaMessage,
  TAKA,
  type TakaChatEntry,
} from "@/lib/takaMessages";
import {
  Send,
  Paperclip,
  Loader2,
  FileBarChart,
  Cpu,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { useHealth } from "@/contexts/HealthContext";

export default function AIPage() {
  const { aiUp } = useHealth();
  const [aiFile, setAiFile] = useState<File | null>(null);
  const [aiContext, setAiContext] = useState<string>("");
  const [aiChatLog, setAiChatLog] = useState<TakaChatEntry[]>([]);
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiFileLoading, setAiFileLoading] = useState<boolean>(false);

  const append = (entry: TakaChatEntry) => setAiChatLog((prev) => [...prev, entry]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setAiFile(file);
    setAiFileLoading(true);

    const formData = new FormData();
    formData.append("File", file);

    try {
      const res = await aiApi.post<{ content: string }>("/process", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAiContext(res.data.content);
      append(createTakaMessage("system", TAKA.system.fileLoaded(file.name)));
    } catch (error) {
      console.error("AI Extractor failed", error);
      append(createTakaMessage("error", TAKA.system.fileLoadFailed));
    } finally {
      setAiFileLoading(false);
    }
  };

  const handleSendChat = async () => {
    if (!aiPrompt.trim() || aiLoading) return;
    const userQ = aiPrompt.trim();
    setAiPrompt("");
    append(createTakaMessage("user", userQ));

    try {
      setAiLoading(true);
      const res = await aiApi.post<{ answer: string }>("/chat", {
        context: aiContext || "No report context attached.",
        question: userQ,
      });
      append(createTakaMessage("assistant", res.data.answer?.trim() || "No response received."));
    } catch (error) {
      console.error("AI Chat failed", error);
      append(createTakaMessage("error", TAKA.error.chatFailed));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-8 space-y-8 max-w-[1500px] mx-auto animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-950/40 p-8 rounded-2xl border border-red-500/20 backdrop-blur-xl shadow-[0_0_30px_rgba(220,38,38,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] translate-x-1/2 -translate-y-1/2" />

          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-red-600/10 flex items-center justify-center rounded-2xl border border-red-500/30 shadow-[0_0_20px_rgba(220,38,38,0.15)] overflow-hidden">
              <EagleIcon size={32} className="text-red-500 relative z-10" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse border border-slate-950" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Cpu size={12} className="text-red-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">
                  KIZUNA Industrial Assistant
                </span>
              </div>
              <span className="text-4xl font-black text-white tracking-tighter leading-none uppercase italic">
                Taka
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-slate-900/50 p-4 rounded-xl border border-red-500/10 relative z-10">
            <div className="flex flex-col items-end border-r border-white/5 pr-6">
              <span className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">Service</span>
              <span
                className={`text-xs font-semibold flex items-center gap-2 ${
                  aiUp ? "text-emerald-400" : "text-red-400 animate-pulse"
                }`}
              >
                {aiUp ? <Activity size={12} /> : <ShieldAlert size={12} />}
                {aiUp ? TAKA.status.online : TAKA.status.offline}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Context</span>
              <span className="text-xs text-white font-semibold">
                {aiUp ? (aiContext ? TAKA.status.contextReady : TAKA.status.awaitingContext) : TAKA.status.syncLost}
              </span>
            </div>
          </div>
        </div>

        <Card className="border-emerald-500/20 bg-slate-950/80 backdrop-blur-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.08)] h-[75vh] flex flex-col relative">
          <div className="p-4 border-b border-emerald-500/10 flex items-center justify-between bg-emerald-950/10 relative z-10 gap-4 flex-wrap">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Conversation</span>
            <div className="flex items-center gap-3">
              {aiContext && aiFile && (
                <Badge
                  variant="outline"
                  className="bg-emerald-950/40 border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase gap-2"
                >
                  <FileBarChart size={12} /> {aiFile.name}
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={() => document.getElementById("ai-uploader")?.click()}
                className="bg-transparent border-emerald-500/30 text-emerald-500 hover:bg-emerald-950/40 text-[10px] font-bold uppercase h-9"
                disabled={aiFileLoading}
              >
                {aiFileLoading ? (
                  <Loader2 size={14} className="animate-spin mr-2" />
                ) : (
                  <Paperclip size={14} className="mr-2" />
                )}
                {aiContext ? TAKA.input.replace : TAKA.input.attach}
              </Button>
              <input
                type="file"
                id="ai-uploader"
                accept=".pdf"
                className="hidden"
                aria-hidden="true"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar relative z-10">
            {aiChatLog.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50 px-4">
                <EagleIcon size={48} className="text-red-500/60 mb-6" />
                <h3 className="text-lg font-bold text-emerald-500/90 mb-2">{TAKA.empty.title}</h3>
                <p className="text-sm text-slate-500 max-w-md leading-relaxed">{TAKA.empty.hint}</p>
              </div>
            ) : (
              aiChatLog.map((entry) => <TakaChatMessage key={entry.id} entry={entry} />)
            )}
            {aiLoading && <TakaThinking />}
          </div>

          <div className="p-6 border-t border-emerald-500/20 bg-slate-950 relative z-10">
            <form
              className="flex gap-3 items-end"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={TAKA.input.placeholder}
                  className="w-full bg-slate-900 border border-emerald-500/20 rounded-xl px-5 py-4 text-sm text-emerald-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-slate-600"
                  disabled={aiLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={aiLoading || !aiPrompt.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 text-black rounded-xl px-8 h-[52px] font-bold uppercase tracking-wide gap-2"
              >
                {TAKA.input.send} <Send size={16} />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
