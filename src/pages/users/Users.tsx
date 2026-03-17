// src/pages/users/Users.tsx
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit2, ShieldCheck, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { USERS_MOCK, IUser } from "@/mocks/userData";

export default function Users() {
  const [users, setUsers] = useState<IUser[]>(USERS_MOCK);

  // MODAIS
  const [deactivateUser, setDeactivateUser] = useState<IUser | null>(null);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<IUser["role"]>("OPERATOR");

  // Mapeamento de cores dos badges
  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      ADMIN: "bg-purple-50 text-purple-600 border-purple-100",
      MANAGER: "bg-blue-50 text-blue-600 border-blue-100",
      INSPECTOR: "bg-emerald-50 text-emerald-600 border-emerald-100",
      OPERATOR: "bg-slate-100 text-slate-600 border-slate-200",
    };
    return styles[role] || styles.OPERATOR;
  };

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">

        {/* CABEÇALHO */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-white/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
              Access Control Layer
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                USERS
              </h1>
              <span className="text-3xl font-thin text-slate-300 tracking-tighter uppercase leading-none">
                Management
              </span>
            </div>
          </div>

          {/* BOTÃO CREATE USER */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-md px-6 shadow-lg shadow-red-200/50 flex items-center gap-2">
                <Plus size={18} strokeWidth={3} /> CREATE USER
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md border-t-4 border-red-600">
              <DialogHeader>
                <DialogTitle className="text-xl font-black tracking-tighter uppercase italic">Register User</DialogTitle>
                <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase">
                  System: Kizuna
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Full Name</label>
                  <Input placeholder="Operator name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email Address</label>
                  <Input type="email" placeholder="user@company.com" />
                </div>
              </div>

              <DialogFooter>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest">
                  Confirm Access
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABELA DE USUÁRIOS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">

          {/* BARRA DE PESQUISA */}
          <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Search users..." 
                className="pl-10 bg-white border-slate-200 focus:ring-red-600 h-10" 
              />
            </div>
            <div className="flex items-center gap-2 text-slate-300 pr-2">
              <ShieldCheck size={16} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Authorized Personnel Only</span>
            </div>
          </div>

          {/* TABELA */}
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b-slate-100">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-8 h-12">Name</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/80 transition-colors border-b-slate-50">
                  <TableCell className="pl-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                        <UserCircle size={18} />
                      </div>
                      <span className="font-bold text-slate-700 tracking-tight">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 font-medium text-sm">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-sm ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={user.status === 'Active' ? 'success' : 'destructive'} className="text-[9px] font-black uppercase px-3">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    {/* BOTÕES SEMPRE VISÍVEIS */}
                    <div className="flex justify-end gap-1">
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                          setEditUser(user);
                          setEditName(user.name);
                          setEditEmail(user.email);
                          setEditRole(user.role);
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit2 size={14} />
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                        onClick={() => { setDeactivateUser(user); setIsDeactivateOpen(true); }}
                      >
                        <ShieldCheck size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* FOOTER DA TABELA */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Showing {users.length} active operators</span>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="text-[10px] font-black h-8">PREV</Button>
               <Button variant="outline" size="sm" className="text-[10px] font-black h-8">NEXT</Button>
            </div>
          </div>
        </div>

        {/* MODAIS (EDIÇÃO E DESATIVAR) */}
        {/* ... Seus modais permanecem inalterados ... */}

      </div>
    </MainLayout>
  );
}