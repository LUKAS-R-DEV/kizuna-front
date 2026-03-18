import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Gauge, 
  ShieldCheck, 
  Boxes, 
  Users, 
  FileBarChart, 
  Bell, 
  History, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const user = {
    initials: "LR",
    name: "Lucas Rafael",
    role: "System Admin",
  };

  // Módulos sincronizados com a hierarquia da imagem
  const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { label: "Production Orders", icon: <ClipboardList size={18} />, path: "/production-orders" },
    { label: "Production Panel", icon: <Gauge size={18} />, path: "/production-panel" },
    { label: "Quality Inspection", icon: <ShieldCheck size={18} />, path: "/quality" },
    { label: "Inventory", icon: <Boxes size={18} />, path: "/inventory" },
    { label: "Users", icon: <Users size={18} />, path: "/users" },
    { label: "Reports", icon: <FileBarChart size={18} />, path: "/reports" },
    { label: "Notifications", icon: <Bell size={18} />, path: "/notifications" },
    { label: "Audit Logs", icon: <History size={18} />, path: "/audit" },
  ];

  return (
    <aside className="flex flex-col h-screen w-64 bg-gradient-to-b from-black via-[#2d0a0a] to-[#450a0a] text-slate-300 shadow-2xl border-r border-white/5">
      
      {/* BRANDING KIZUNA */}
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-red-700 rounded flex items-center justify-center font-black text-white italic shadow-lg shadow-red-900/40">
            K
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white leading-none">KIZUNA</h1>
          </div>
        </div>
      </div>

      {/* NAVIGATION ENGINE */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-none">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              group flex items-center justify-between px-4 py-3 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-300
              ${isActive 
                ? "bg-red-600 text-white shadow-lg shadow-red-900/40 border-l-4 border-white translate-x-1" 
                : "hover:bg-white/5 hover:text-white text-slate-400"}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="transition-colors group-hover:text-red-500">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
            {/* O Chevron aparece apenas no item ativo para reforçar o foco operacional */}
            <ChevronRight size={14} className="opacity-0 group-[.active]:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* FOOTER - USER STATUS */}
      <div className="p-4 mt-auto bg-black/40 backdrop-blur-md border-t border-white/5">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="relative">
            <Avatar className="h-10 w-10 border border-red-500/30">
              <AvatarFallback className="bg-gradient-to-br from-red-700 to-red-900 text-white text-[10px] font-black">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            {/* LED de Status Nominal */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-white truncate uppercase tracking-tighter">{user.name}</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">System Nominal</span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 h-10 px-3 font-black text-[10px] uppercase tracking-widest transition-all border border-transparent hover:border-red-900/50"
        >
          <LogOut size={16} />
          Terminal Exit
        </Button>
      </div>
    </aside>
  );
}