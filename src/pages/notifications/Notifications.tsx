import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notificationApi } from "@/lib/api";
import { formatApiDateTime } from "@/lib/datetime";
import { 
  Bell, Trash2, CheckCheck, AlertTriangle, 
  PlayCircle, CheckCircle2, History, Loader2,
  Info
} from "lucide-react";

interface INotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.get<INotification[]>("");
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationApi.patch(`/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationApi.delete(`/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.isRead);
      await Promise.all(unread.map(n => notificationApi.patch(`/${n.id}/read`)));
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear all notifications?")) return;
    try {
      await Promise.all(notifications.map(n => notificationApi.delete(`/${n.id}`)));
      fetchNotifications();
    } catch (error) {
      console.error("Failed to clear notifications", error);
    }
  };

  const stats = [
    { label: "Total", val: notifications.length, color: "text-slate-300", bg: "bg-white/[0.05] border border-white/10" },
    { label: "Unread", val: notifications.filter(n => !n.isRead).length, color: "text-blue-500", bg: "bg-blue-950/30 border border-blue-900/50 shadow-[0_0_8px_rgba(59,130,246,0.2)]" },
    { label: "System", val: notifications.length, color: "text-emerald-500", bg: "bg-emerald-950/30 border border-emerald-900/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]" },
    { label: "Critical", val: 0, color: "text-red-500", bg: "bg-red-950/30 border border-red-900/50 shadow-[0_0_8px_rgba(220,38,38,0.2)]" },
  ];

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        {/* HEADER KIZUNA STANDARD */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-transparent/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-red-600 animate-pulse rounded-full" />
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em]">Signal & Communication Gate</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">
              Notifications
            </h1>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleMarkAllAsRead}
              className="text-[10px] font-black uppercase h-11 px-6 gap-2 border-white/10 hover:bg-white/5"
            >
              <CheckCheck size={14} className="text-blue-600" /> Mark All Read
            </Button>
            <Button 
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase h-11 px-6 gap-2 shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
            >
              <Trash2 size={14} /> Clear Archive
            </Button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-transparent/40 backdrop-blur-md p-5 rounded-xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 items-center gap-1 uppercase flex tracking-widest leading-none ring-1 ring-white/5 px-2 py-1 rounded w-fit mb-2">
                   <Info size={8} /> {s.label}
                </p>
                <p className="text-3xl font-black text-white tracking-tighter leading-none italic">
                  {s.val.toString().padStart(2, '0')}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${s.bg} ${s.color} flex items-center justify-center transition-transform group-hover:scale-110`}><Bell size={18} /></div>
            </div>
          ))}
        </div>

        {/* FEED */}
        <div className="bg-transparent rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="bg-slate-900/80 p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={16} className="text-slate-500" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Incoming Spectral Signals</h2>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          
          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-center space-y-3">
                 <Loader2 className="animate-spin text-red-600" size={32} />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Synchronizing with relay server...</p>
              </div>
            ) : notifications.length > 0 ? notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-6 flex items-start gap-6 hover:bg-white/[0.03] transition-all border-l-4 group relative overflow-hidden ${
                  !notif.isRead ? 'border-red-600 bg-red-600/[0.02]' : 'border-transparent hover:border-slate-700'
                }`}
              >
                {!notif.isRead && <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[60px] -mr-16 -mt-16 pointer-events-none" />}
                
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${
                  !notif.isRead 
                  ? 'bg-red-950/30 text-red-500 border border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.2)] animate-pulse' 
                  : 'bg-white/[0.03] text-slate-500 border border-white/5'
                }`}>
                  {!notif.isRead ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                </div>

                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black text-slate-600 italic tracking-tighter">SIG-#{notif.id.slice(-4).toUpperCase()}</span>
                    <Badge className={`${!notif.isRead ? 'bg-red-950/50 text-red-500' : 'bg-white/[0.05] text-slate-500'} border-transparent text-[8px] font-black uppercase px-2`}>
                       {notif.isRead ? 'Archived' : 'Active Signal'}
                    </Badge>
                  </div>
                  <h3 className={`text-base font-black uppercase tracking-tight italic leading-none mb-2 ${!notif.isRead ? 'text-white' : 'text-slate-400'}`}>
                    {notif.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold italic border-l-2 border-white/5 pl-3 py-1 bg-white/[0.01]">
                    {notif.message}
                  </p>
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
                    <History size={10} /> REC-TIMESTAMP: {formatApiDateTime(notif.timestamp)}
                  </p>
                </div>

                <div className="flex flex-col gap-1 relative z-10 h-full justify-center">
                  {!notif.isRead && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="h-9 w-9 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all rounded-full border border-transparent hover:border-emerald-500/20"
                    >
                      <CheckCheck size={18} />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(notif.id)}
                    className="h-9 w-9 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-full border border-transparent hover:border-red-500/20"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            )) : (
              <div className="py-32 flex flex-col items-center justify-center text-center space-y-4 opacity-40 grayscale">
                 <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                    <Bell size={40} className="text-slate-500" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">No Signals Detected</h3>
                    <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tight">The communication relay is currently silent.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}