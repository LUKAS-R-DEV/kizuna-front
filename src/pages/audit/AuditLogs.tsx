import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { auditApi } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ShieldAlert, 
  Search, 
  User, 
  Activity, 
  Globe, 
  CheckCircle2, 
  Loader2,
  Terminal
} from "lucide-react";

interface IAudit {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  username: string;
  userId: string;
  timestamp: string;
  details: Record<string, any>;
}

interface IPageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<IAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [page, pageSize]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await auditApi.get<IPageResponse<IAudit>>(`/audit?page=${page}&size=${pageSize}`);
      setLogs(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatAuditDate = (timestamp: any) => {
    let date: Date;
    if (Array.isArray(timestamp)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = timestamp;
      date = new Date(year, month - 1, day, hour, minute, second);
    } else {
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) return { time: "INVALID", date: "INVALID" };

    return {
      time: date.toLocaleTimeString('pt-BR'),
      date: date.toLocaleDateString('pt-BR')
    };
  };

  const securityCount = logs.filter(log => log.entity?.toUpperCase() === 'SECURITY').length;

  const stats = [
    { label: "Total Trace", val: totalElements, icon: <Activity />, color: "text-blue-500", bg: "bg-blue-950/30 border border-blue-900/50 shadow-[0_0_8px_rgba(59,130,246,0.2)]" },
    { label: "Verified", val: logs.length, icon: <CheckCircle2 />, color: "text-emerald-500", bg: "bg-emerald-950/30 border border-emerald-900/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]" },
    { label: "Security", val: securityCount, icon: <ShieldAlert />, color: "text-amber-500", bg: "bg-amber-950/30 border border-amber-900/50 shadow-[0_0_8_px_rgba(245,158,11,0.2)]" },
  ];

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        
        {/* HEADER KIZUNA */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-transparent/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">System Traceability Relay</span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Audit</h1>
              <span className="text-4xl font-black text-red-600 tracking-tighter uppercase leading-none">Logs</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 border border-white/5 bg-white/[0.02] rounded flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connection: Secure</span>
             </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-3 gap-6">
          {stats.map((card, i) => (
            <Card key={i} className="p-5 flex flex-col items-center justify-center gap-4 group hover:border-white/20 transition-all border-white/5 bg-transparent/40 backdrop-blur-md">
              <div className="text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">{card.label}</p>
                <p className="text-3xl font-black text-white tracking-tighter italic">
                  {card.val.toString().padStart(2, '0')}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${card.bg} ${card.color} flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg`}>
                {card.icon}
              </div>
            </Card>
          ))}
        </div>

        {/* FILTERS & SEARCH */}
        <div className="flex flex-row flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH LOGS BY USER, ACTION OR MODULE..." 
              className="pl-10 text-[11px] font-bold uppercase h-12 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:border-red-600/50 transition-all" 
            />
          </div>
        </div>

        {/* AUDIT TABLE */}
        <div className="bg-transparent rounded-xl border border-white/10 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="bg-slate-900/60 p-4 border-b border-white/10 flex items-center gap-2">
            <Terminal size={14} className="text-red-700" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Stream: Raw Data Access</h2>
          </div>
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] uppercase font-black text-slate-500">Timestamp</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-slate-500">Subject</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-slate-500">Operation</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-slate-500">Module</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-slate-500">Payload Details</TableHead>
                <TableHead className="text-center text-[10px] uppercase font-black text-slate-500">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={32} className="animate-spin text-red-700" />
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] animate-pulse">Decrypting system stream...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-white/[0.02] border-white/5 transition-colors group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-white italic tracking-tighter">
                          {formatAuditDate(log.timestamp).time}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase">
                          {formatAuditDate(log.timestamp).date}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400">
                          <User size={14} />
                        </div>
                        <div className="flex flex-col leading-none">
                          <span className="text-xs font-black text-white uppercase tracking-tight">{log.username || "System"}</span>
                          <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">ID: {log.userId?.slice(-6) || "AUTO"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-black text-slate-200 uppercase tracking-tighter">{log.details?.action || log.action}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-red-950/20 text-red-500 border-red-900/30 text-[9px] font-black uppercase px-2 py-0.5 shadow-sm">
                        {log.entity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 max-w-md">
                        <div className="flex flex-wrap gap-2">
                          {log.details ? Object.entries(log.details)
                            .filter(([k]) => k !== 'action')
                            .map(([k, v]) => (
                              <div key={k} className="bg-white/5 px-2 py-0.5 rounded border border-white/5 flex items-center gap-1.5">
                                <span className="text-[8px] font-black text-slate-500 uppercase">{k}:</span>
                                <span className="text-[10px] font-bold text-slate-300 truncate max-w-[150px]">{String(v)}</span>
                              </div>
                            )) : <span className="text-[10px] font-bold text-slate-600">NO_DETAILS</span>}
                        </div>
                        <span className="text-[8px] font-black text-slate-700 tracking-widest uppercase italic mt-1">Entity ID: {log.entityId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 text-[9px] font-black uppercase px-3 py-1 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        VERIFIED
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center border-none">
                    <div className="flex flex-col items-center gap-3 opacity-20 grayscale">
                      <ShieldAlert size={48} className="text-slate-500" />
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">No logs detected in the relay</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* TABLE FOOTER / PAGINATION */}
          <div className="bg-slate-900/40 backdrop-blur-sm p-4 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">
                  Registry Stream: {totalElements.toString().padStart(4, '0')} Nodes
                </p>
              </div>
              
              <div className="flex items-center gap-1">
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={() => setPage(p => Math.max(0, p - 1))}
                   disabled={page === 0 || loading}
                   className="text-[10px] font-black uppercase text-slate-400 hover:text-white"
                 >
                   Prev
                 </Button>
                 <div className="flex items-center gap-1 px-3">
                    <span className="text-[10px] font-black text-red-600">{page + 1}</span>
                    <span className="text-[10px] font-black text-slate-600">/</span>
                    <span className="text-[10px] font-black text-slate-400">{totalPages}</span>
                 </div>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                   disabled={page >= totalPages - 1 || loading}
                   className="text-[10px] font-black uppercase text-slate-400 hover:text-white"
                 >
                   Next
                 </Button>
              </div>
            </div>

            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
              <Globe size={10} /> Node: Master-Terminal-01
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}