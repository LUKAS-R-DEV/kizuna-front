import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_AUDIT_LOGS } from "../../mocks/audit";
import { 
  ShieldAlert, 
  Search, 
  Download, 
  User, 
  Activity, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  XCircle 
} from "lucide-react";

export default function AuditLogsPage() {
  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        
        {/* HEADER KIZUNA */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-white/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">System Traceability</span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Audit</h1>
              <span className="text-3xl font-thin text-slate-300 tracking-tighter uppercase leading-none">Logs</span>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: "Total de Logs", val: "12", icon: <Activity />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Bem-sucedidos", val: "10", icon: <CheckCircle2 />, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Avisos", val: "01", icon: <AlertCircle />, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Falhas", val: "01", icon: <XCircle />, color: "text-red-600", bg: "bg-red-50" },
          ].map((card, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-red-200 transition-all">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{card.label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{card.val}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* FILTERS & SEARCH */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input placeholder="SEARCH LOGS BY USER, ACTION OR MODULE..." className="pl-10 text-[11px] font-bold uppercase h-10 bg-slate-50/50" />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-[10px] font-black uppercase tracking-widest h-10 px-6 gap-2 shadow-lg shadow-blue-900/10">
            <Download size={14} /> Exportar Logs
          </Button>
        </div>

        {/* AUDIT TABLE */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuário</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Módulo</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalhes</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">IP</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-900 italic tracking-tighter">{log.timestamp.split(' ')[1]}</span>
                        <span className="text-[9px] font-bold text-slate-400">{log.timestamp.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <User size={14} />
                        </div>
                        <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600 uppercase">{log.action}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none text-[9px] font-black uppercase px-2">
                        {log.module}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[11px] font-medium text-slate-500 italic leading-snug max-w-xs line-clamp-1 group-hover:line-clamp-none transition-all">
                        {log.details}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Globe size={12} />
                        <span className="text-[10px] font-mono font-bold tracking-widest">{log.ip}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-black uppercase px-3 py-1">
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className="bg-slate-900 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">
                Secure Audit Stream Active <span className="text-slate-800 mx-2">//</span> Global Registry
              </p>
            </div>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">
              Encrypted Ledger: SHA-256 Verified
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}