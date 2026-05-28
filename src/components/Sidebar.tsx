import { useState } from "react";
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
  ChevronRight,
  ListOrdered,
  FlaskConical,
  Bot,
  Activity,
  BrainCircuit,
  KeyRound
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getUsername, doLogout, getRoles } from "@/lib/auth";
import { hasAnyRole } from "@/lib/roles";
import { useHealth } from "@/contexts/HealthContext";

export default function Sidebar() {
  const { colorClass, textStatus, colorHex } = useHealth();

  const username = getUsername() || "Lucas Rafael";
  const userRoles = getRoles();
  const initials = username.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "LR";

  const user = {
    initials: initials,
    name: username,
    role: userRoles.includes("admin") ? "System Admin" : userRoles[0] || "Operator",
  };

  const rawMenuItems = [
    { label: "Home", icon: <LayoutDashboard size={18} />, path: "/home", roles: ["*"] },
    { label: "Dashboard", icon: <Gauge size={18} />, path: "/dashboard", roles: ["EXECUTIVE"] },
    { label: "Production Orders", icon: <ClipboardList size={18} />, path: "/production-orders", roles: ["PLANNER", "OPERATOR"] },
    { label: "Production Queue", icon: <ListOrdered size={18} />, path: "/production-queue", roles: ["PLANNER"] },
    { label: "Recipes", icon: <FlaskConical size={18} />, path: "/recipes", roles: ["PLANNER"] },
    { label: "Production Panel", icon: <Gauge size={18} />, path: "/production-panel", roles: ["OPERATOR"] },
    { label: "Quality Inspection", icon: <ShieldCheck size={18} />, path: "/quality", roles: ["INSPECTOR"] },
    { label: "Inventory", icon: <Boxes size={18} />, path: "/inventory", roles: ["INVENTORY_MANAGER"] },
    { label: "Users", icon: <Users size={18} />, path: "/users", roles: ["MANAGE-USERS", "manage-users"] },
    { label: "Reports", icon: <FileBarChart size={18} />, path: "/reports", roles: ["EXECUTIVE"] },
    { label: "Notifications", icon: <Bell size={18} />, path: "/notifications", roles: ["*"] },
    { label: "Audit Logs", icon: <History size={18} />, path: "/audit", roles: ["AUDITOR"] },
    { label: "TAKA CORE", icon: <BrainCircuit size={18} />, path: "/ai", roles: ["EXECUTIVE"] },
    { label: "System Health", icon: <Activity size={18} />, path: "/admin/health", roles: ["ADMIN"] },
    { label: "API Integração", icon: <KeyRound size={18} />, path: "/admin/integration-keys", roles: ["ADMIN"] },
  ];

  const menuItems = rawMenuItems.filter((item) => {
    if (item.roles.includes("*")) return true;
    return hasAnyRole(userRoles, item.roles);
  });

  return (
    <aside className="flex flex-col h-full w-64 bg-[#050505] text-slate-300 shadow-2xl border-r border-white/5 relative z-10">
      
      {/* BRANDING KIZUNA (Classic) */}
      <div className="p-7 mb-4">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-red-600 rounded-md flex items-center justify-center font-black text-white italic shadow-[0_4px_14px_rgba(220,38,38,0.4)]">
            K
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white leading-none">KIZUNA</h1>
          </div>
        </div>
      </div>

      {/* NAVIGATION ENGINE */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-none">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              group flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300
              ${isActive 
                ? "bg-red-600 text-white shadow-[0_4px_14px_rgba(220,38,38,0.3)] border-l-4 border-white translate-x-1" 
                : "hover:bg-white/[0.04] text-slate-500 hover:text-white"}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="transition-colors group-hover:text-red-500 group-[.active]:text-white">
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
      <div className="p-5 mt-auto bg-black/60 border-t border-white/[0.02]">
        <div className="flex items-center gap-3 mb-5 px-2">
          <div className="relative">
            <Avatar className="h-10 w-10 border border-white/10 ring-2 ring-transparent transition-all">
              <AvatarFallback className="bg-red-600 text-white text-[10px] font-black">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            {/* LED de Status Nominal / Semaforo */}
            <div className={`absolute bottom-0 right-[-2px] w-3 h-3 ${colorClass} border-2 border-[#050505] rounded-full transition-colors duration-500`} />
          </div>
          <div className="flex flex-col min-w-0 transition-colors duration-500">
            <span className="text-xs font-black text-white truncate uppercase tracking-tighter">{user.name}</span>
            <span className={`text-[9px] font-bold uppercase tracking-tight ${colorHex}`}>
               {textStatus}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => doLogout()}
          className="w-full justify-start gap-3 text-slate-500 hover:text-red-500 hover:bg-white/[0.04] h-10 px-4 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl"
        >
          <LogOut size={16} />
          Terminal Exit
        </Button>
      </div>
    </aside>
  );
}