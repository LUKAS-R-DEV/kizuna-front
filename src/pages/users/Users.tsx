// src/pages/users/Users.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit2, ShieldCheck, UserCircle, ShieldAlert } from "lucide-react";
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
      OPERATOR: "bg-slate-100 text-slate-800 border-slate-200",
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
              <span className="text-4xl font-black text-red-600 tracking-tighter leading-none">
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
                <DialogDescription className="text-[10px] font-bold text-slate-800 uppercase">
                  System: Kizuna
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-800 uppercase ml-1">Full Name</label>
                  <Input placeholder="Operator name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-800 uppercase ml-1">Email Address</label>
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
        <Card className="p-0 border-slate-200/60 overflow-hidden">

          {/* BARRA DE PESQUISA */}
          <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-800" size={16} />
              <Input 
                placeholder="Search users..." 
                className="pl-10 bg-white border-slate-200 focus:ring-red-600 h-10" 
              />
            </div>
            <div className="flex items-center gap-2 text-slate-700 pr-2">
              <ShieldCheck size={16} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Authorized Personnel Only</span>
            </div>
          </div>

          {/* TABELA */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 transition-colors">
                        <UserCircle size={18} />
                      </div>
                      <span className="font-bold text-slate-700 tracking-tight">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-700 font-medium text-sm">{user.email}</span>
                  </TableCell>
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
                  <TableCell className="text-right">
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
            <span className="text-[10px] font-bold text-slate-800 uppercase">Showing {users.length} active operators</span>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="text-[10px] font-black h-8">PREV</Button>
               <Button variant="outline" size="sm" className="text-[10px] font-black h-8">NEXT</Button>
            </div>
          </div>
        </Card>

        {/* MODAIS (EDIÇÃO E DESATIVAR) */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md border-t-[6px] border-blue-600 bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-black tracking-tighter uppercase italic text-slate-900 flex items-center gap-2">
                <Edit2 className="text-blue-600" size={20} /> Edit <span className="text-blue-600">Access</span>
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                Update operator credentials // Kizuna Security Layer
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-800 uppercase ml-1">Full Name</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Operator name" className="font-bold italic" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-800 uppercase ml-1">Email Address</label>
                <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="user@company.com" className="font-bold italic text-slate-800" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-800 uppercase ml-1">System Role</label>
                <Select value={editRole} onValueChange={(val: any) => setEditRole(val)}>
                  <SelectTrigger className="font-bold uppercase text-[11px] h-10 border-slate-200">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN" className="font-bold uppercase text-[10px]">Administrator</SelectItem>
                    <SelectItem value="MANAGER" className="font-bold uppercase text-[10px]">Manager</SelectItem>
                    <SelectItem value="INSPECTOR" className="font-bold uppercase text-[10px]">Inspector</SelectItem>
                    <SelectItem value="OPERATOR" className="font-bold uppercase text-[10px]">Operator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setIsEditOpen(false)} variant="ghost" className="text-[10px] font-black uppercase text-slate-700 hover:text-slate-800">Cancel</Button>
              <Button onClick={() => setIsEditOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest px-8 shadow-md shadow-blue-900/20">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
          <DialogContent className="max-w-md border-t-[6px] border-amber-500 bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-black tracking-tighter uppercase italic text-slate-900 flex items-center gap-2">
                <ShieldAlert className="text-amber-500" size={22} /> Suspend <span className="text-amber-500">Access</span>
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                Revoke system privileges // Kizuna Security Layer
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 flex flex-col items-center justify-center text-center gap-4 bg-amber-50/50 rounded-lg border border-amber-100/50 mt-2 mb-4">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-500 border border-amber-100">
                <ShieldCheck size={32} />
              </div>
              <div className="px-6">
                <p className="font-black text-slate-700 text-sm leading-tight">
                  Are you sure you want to suspend <br/>
                  <span className="text-amber-600 italic uppercase text-lg">{deactivateUser?.name}</span>?
                </p>
                <p className="text-[10px] font-bold uppercase text-slate-800 tracking-wider mt-3">
                  This operator will lose access immediately.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setIsDeactivateOpen(false)} variant="ghost" className="text-[10px] font-black uppercase text-slate-700">Cancel</Button>
              <Button onClick={() => setIsDeactivateOpen(false)} className="bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest px-6 shadow-md shadow-amber-900/20">
                Confirm Suspension
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </MainLayout>
  );
}