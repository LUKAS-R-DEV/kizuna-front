// src/components/Sidebar.tsx
import { 
  Home, 
  FileText, 
  Package, 
  LogOut, 
  Users, 
  ClipboardList, 
  ListOrdered, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  SearchCheck 
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const user = {
    initials: "LR",
    name: "Lucas Rafael",
    role: "Admin",
  };

  return (
    <aside className="flex flex-col h-screen w-64 bg-gradient-to-b from-black via-red-950 to-red-900 text-white">
      
      {/* Header - Identidade */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wider text-white">KIZUNA</h1>
        <p className="text-[10px] uppercase opacity-60 tracking-[0.15em] font-medium">Industrial Management</p>
      </div>

      {/* Navegação - Todos os módulos da imagem */}
      <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-red-600/40 border border-red-500/50 text-white transition-colors">
          <Home size={18} /> 
          <span className="text-sm font-medium">Dashboard</span>
        </a>
        
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-red-100/80 hover:text-white">
          <Users size={18} /> 
          <span className="text-sm font-medium">Users</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-red-100/80 hover:text-white">
          <ClipboardList size={18} /> 
          <span className="text-sm font-medium">Production Orders</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-red-100/80 hover:text-white">
          <ListOrdered size={18} /> 
          <span className="text-sm font-medium">Production Queue</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-red-100/80 hover:text-white">
          <Activity size={18} /> 
          <span className="text-sm font-medium">Operator Panel</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-red-100/80 hover:text-white">
          <ShieldCheck size={18} /> 
          <span className="text-sm font-medium">Quality Inspection</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-red-100/80 hover:text-white">
          <Package size={18} /> 
          <span className="text-sm font-medium">Inventory</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-red-100/80 hover:text-white">
          <TrendingUp size={18} /> 
          <span className="text-sm font-medium">Stock Movement</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-red-100/80 hover:text-white">
          <FileText size={18} /> 
          <span className="text-sm font-medium">Reports</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-red-100/80 hover:text-white">
          <SearchCheck size={18} /> 
          <span className="text-sm font-medium">Audit</span>
        </a>
      </nav>

      {/* Rodapé - Usuário e Logout */}
      <div className="mt-auto border-t border-white/10 p-4 space-y-4 bg-black/20">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-10 w-10 border border-red-500/50 shrink-0">
            <AvatarFallback className="bg-red-950 text-white text-xs">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">{user.name}</span>
            <span className="text-[10px] text-red-200/60 uppercase tracking-tighter">{user.role}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="flex items-center gap-3 px-2 py-1 h-auto w-full justify-start text-red-200/70 hover:text-white hover:bg-white/10 font-normal transition-all"
        >
          <LogOut size={16} />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </aside>
  );
}