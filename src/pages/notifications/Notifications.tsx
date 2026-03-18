import MainLayout from "@/layouts/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_NOTIFICATIONS } from "../../mocks/notifications";
import { Bell, Trash2, CheckCheck, AlertTriangle, PlayCircle, CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
  const stats = [
    { label: "Total", val: MOCK_NOTIFICATIONS.length, color: "text-slate-600", bg: "bg-slate-50" },
    { label: "Não Lidas", val: MOCK_NOTIFICATIONS.filter(n => n.isNew).length, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Produção", val: MOCK_NOTIFICATIONS.filter(n => n.category === 'Produção').length, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Estoque", val: MOCK_NOTIFICATIONS.filter(n => n.category === 'Estoque').length, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        {/* HEADER KIZUNA */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-white/40">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Notifications</h1>
          <div className="flex gap-3">
            <Button variant="outline" className="text-[10px] font-black uppercase h-11 px-6 gap-2"><CheckCheck size={14} className="text-blue-600" /> Marcar Lidas</Button>
            <Button className="bg-red-600 text-white text-[10px] font-black uppercase h-11 px-6 gap-2"><Trash2 size={14} /> Limpar</Button>
          </div>
        </div>

        {/* STATS CARDS PUXANDO DO MOCK */}
        <div className="grid grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase">{s.label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.val.toString().padStart(2, '0')}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${s.bg} ${s.color} flex items-center justify-center`}><Bell size={18} /></div>
            </div>
          ))}
        </div>

        {/* FEED PUXANDO DO MOCK */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
          {MOCK_NOTIFICATIONS.map((notif) => (
            <div key={notif.id} className="p-6 flex items-start gap-6 hover:bg-slate-50 transition-all border-l-4 border-transparent hover:border-red-600 group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                notif.type === 'danger' ? 'bg-red-50 text-red-600' : 
                notif.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {notif.type === 'danger' ? <AlertTriangle size={20} /> : notif.type === 'warning' ? <PlayCircle size={20} /> : <CheckCircle2 size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black text-slate-400 italic">{notif.id}</span>
                  <Badge className="bg-slate-100 text-slate-600 text-[8px] font-black uppercase border-none px-2">{notif.category}</Badge>
                  {notif.isNew && <Badge className="bg-red-600 text-white text-[8px] font-black uppercase animate-pulse">Nova</Badge>}
                </div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">{notif.title}</h3>
                <p className="text-xs text-slate-500 font-bold italic mt-1">{notif.description}</p>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mt-3">TIMESTAMP: {notif.timestamp}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600"><CheckCheck size={16} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600"><Trash2 size={16} /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}