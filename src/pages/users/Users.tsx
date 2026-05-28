// src/pages/users/Users.tsx
import { useState, useEffect } from "react";
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
import { Plus, Search, Edit2, ShieldCheck, UserCircle, ShieldAlert, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { iamApi } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { getApiErrorMessage } from "@/lib/apiError";
import { showToast, TOAST } from "@/lib/toastMessages";
import { pickPrimaryRole } from "@/lib/roles";

export interface IUser {
  keycloakId: string;
  username: string;
  fullName: string;
  email: string;
  enabled?: boolean;
  roles: string[];
}

export default function Users() {
  const { success, error: toastError, warning } = useToast();
  const [users, setUsers] = useState<IUser[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await iamApi.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await iamApi.get("/users/roles");
      setRoles(res.data || []);
      if (res.data && res.data.length > 0) {
        setCreateForm(prev => ({ ...prev, role: res.data[0] }));
      }
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("OPERATOR");
  const [editing, setEditing] = useState(false);

  const handleEditUser = async () => {
    if (!editUser) return;
    try {
      setEditing(true);
      // Since editName is fullName, we'll split it for the backend
      const parts = editName.split(" ");
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ");
      
      await iamApi.put(`/users/${editUser.keycloakId}`, {
        username: editUser.username,
        email: editEmail,
        firstName,
        lastName,
        role: editRole,
      });
      setIsEditOpen(false);
      fetchUsers();
      showToast(success, TOAST.users.updated);
    } catch (error) {
      console.error("Failed to update user", error);
      toastError(TOAST.users.updateFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    } finally {
      setEditing(false);
    }
  };

  const [deactivateUser, setDeactivateUser] = useState<IUser | null>(null);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const openDeactivate = (user: IUser) => {
    setDeactivateUser(user);
    setIsDeactivateOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!deactivateUser) return;
    try {
      setDeactivating(true);
      await iamApi.delete(`/users/${deactivateUser.keycloakId}`);
      setIsDeactivateOpen(false);
      fetchUsers();
      showToast(warning, TOAST.users.suspended);
    } catch (error) {
      console.error("Failed to delete user", error);
      toastError(TOAST.users.suspendFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    } finally {
      setDeactivating(false);
    }
  };

  // Novo modal de criação
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "OPERATOR",
  });
  const [creating, setCreating] = useState(false);

  const handleCreateUser = async () => {
    try {
      setCreating(true);
      await iamApi.post("/users/create", createForm);
      setIsCreateOpen(false);
      setCreateForm({ username: "", firstName: "", lastName: "", email: "", role: "OPERATOR" });
      fetchUsers(); // Refresh list
      showToast(success, TOAST.users.created);
    } catch (err) {
      console.error("Failed to create user", err);
      toastError(TOAST.users.createFailed.title, getApiErrorMessage(err, TOAST.common.requestFailed.message));
    } finally {
      setCreating(false);
    }
  };

  // Mapeamento de cores dos badges
  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      ADMIN: "bg-purple-950/30 text-purple-500 border border-purple-900/50 shadow-[0_0_8px_rgba(168,85,247,0.2)]",
      EXECUTIVE: "bg-amber-950/30 text-amber-500 border border-amber-900/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]",
      MANAGER: "bg-blue-950/30 text-blue-500 border border-blue-900/50 shadow-[0_0_8px_rgba(59,130,246,0.2)]",
      PLANNER: "bg-cyan-950/30 text-cyan-500 border border-cyan-900/50 shadow-[0_0_8px_rgba(6,182,212,0.2)]",
      INSPECTOR: "bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
      OPERATOR: "bg-white/[0.05] text-slate-400 border border-white/10",
    };
    return styles[role] || styles.OPERATOR;
  };

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">

        {/* CABEÇALHO */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-transparent/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
              Access Control Layer
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-white tracking-tighter leading-none">
                USERS
              </h1>
              <span className="text-4xl font-black text-red-600 tracking-tighter leading-none">
                Management
              </span>
            </div>
          </div>

          {/* BOTÃO CREATE USER */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-md px-6 shadow-lg shadow-red-200/50 flex items-center gap-2">
                <Plus size={18} strokeWidth={3} /> CREATE USER
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md border-t-4 border-red-600 bg-black/95 backdrop-blur-xl border-white/10 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
              <DialogHeader>
                <DialogTitle className="text-xl font-black tracking-tighter uppercase italic">Register User</DialogTitle>
                <DialogDescription className="text-[10px] font-bold text-slate-300 uppercase">
                  System: Kizuna IAM Orchestration
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-300 uppercase ml-1">First Name</label>
                     <Input required value={createForm.firstName} onChange={(e) => setCreateForm({...createForm, firstName: e.target.value})} placeholder="John" className="bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-300 uppercase ml-1">Last Name</label>
                     <Input required value={createForm.lastName} onChange={(e) => setCreateForm({...createForm, lastName: e.target.value})} placeholder="Doe" className="bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors" />
                   </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-300 uppercase ml-1">Username</label>
                  <Input required value={createForm.username} onChange={(e) => setCreateForm({...createForm, username: e.target.value})} placeholder="johndoe" className="bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-300 uppercase ml-1">Email Address</label>
                  <Input required type="email" value={createForm.email} onChange={(e) => setCreateForm({...createForm, email: e.target.value})} placeholder="user@company.com" className="bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors" />
                </div>


                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-300 uppercase ml-1">System Role</label>
                  <Select value={createForm.role} onValueChange={(val: any) => setCreateForm({...createForm, role: val})}>
                    <SelectTrigger className="font-bold uppercase text-[11px] h-10 border-white/10">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r} value={r} className="font-bold uppercase text-[10px]">
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button 
                   onClick={handleCreateUser} 
                   disabled={creating}
                   className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest"
                >
                  {creating ? <Loader2 className="animate-spin" size={16} /> : "Confirm Access"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABELA DE USUÁRIOS */}
        <Card className="p-0 border-white/10/60 overflow-hidden">

          {/* BARRA DE PESQUISA */}
          <div className="p-4 border-b border-slate-50 bg-white/[0.02]/30 flex justify-between items-center">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <Input 
                placeholder="Search users..." 
                className="pl-10 bg-transparent border-white/10 focus:ring-red-600 h-10" 
              />
            </div>
            <div className="flex items-center gap-2 text-slate-400 pr-2">
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
              {users.map((user) => {
                const primaryRole = pickPrimaryRole(user.roles);
                return (
                <TableRow key={user.keycloakId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 shadow-[0_0_8px_rgba(255,255,255,0.05)] flex items-center justify-center text-slate-300 transition-colors">
                        <UserCircle size={18} />
                      </div>
                      <span className="font-bold text-slate-400 tracking-tight">{user.fullName} ({user.username})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-400 font-medium text-sm">{user.email}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-[0_4px_15px_rgba(0,0,0,0.3)] ${getRoleBadge(primaryRole ?? "OPERATOR")}`}>
                      {primaryRole ?? "UNKNOWN"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={user.enabled !== false ? 'success' : 'destructive'} className="text-[9px] font-black uppercase px-3">
                      {user.enabled !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* BOTÕES SEMPRE VISÍVEIS */}
                    <div className="flex justify-end gap-1">
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-500 hover:bg-white/10 hover:text-blue-400"
                        onClick={() => {
                          setEditUser(user);
                          setEditName(user.fullName);
                          setEditEmail(user.email);
                          setEditRole(primaryRole ?? roles[0] ?? "OPERATOR");
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit2 size={14} />
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-amber-500 hover:bg-white/10 hover:text-amber-400"
                        onClick={() => openDeactivate(user)}
                      >
                        <ShieldCheck size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
              })}
            </TableBody>
          </Table>

          {/* FOOTER DA TABELA */}
          <div className="p-4 bg-white/[0.02]/50 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-300 uppercase">Showing {users.length} active operators</span>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="text-[10px] font-black h-8">PREV</Button>
               <Button variant="outline" size="sm" className="text-[10px] font-black h-8">NEXT</Button>
            </div>
          </div>
        </Card>

        {/* MODAIS (EDIÇÃO E DESATIVAR) */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md border-t-4 border-blue-600 bg-black/95 backdrop-blur-xl border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
            <DialogHeader>
              <DialogTitle className="text-xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
                <Edit2 className="text-blue-600" size={20} /> Edit <span className="text-blue-600">Access</span>
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                Update operator credentials // Kizuna Security Layer
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-300 uppercase ml-1">Full Name</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Operator name" className="font-bold italic bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-blue-600 focus:border-blue-600 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-300 uppercase ml-1">Email Address</label>
                <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="user@company.com" className="font-bold italic bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-blue-600 focus:border-blue-600 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-300 uppercase ml-1">System Role</label>
                <Select value={editRole} onValueChange={(val: any) => setEditRole(val)}>
                  <SelectTrigger className="font-bold uppercase text-[11px] h-10 border-white/10">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r} className="font-bold uppercase text-[10px]">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setIsEditOpen(false)} variant="ghost" className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-300">Cancel</Button>
              <Button onClick={handleEditUser} disabled={editing} className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest px-8 shadow-md shadow-blue-900/20">
                {editing ? <Loader2 className="animate-spin" size={16} /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmModal
          isOpen={isDeactivateOpen}
          onClose={() => setIsDeactivateOpen(false)}
          onConfirm={handleDeleteUser}
          title="Suspend Access"
          description={`Are you sure you want to revoke all system privileges for ${deactivateUser?.fullName}? This operator will lose access immediately.`}
          variant="warning"
          confirmLabel="Confirm Suspension"
          loading={deactivating}
        />

      </div>
    </MainLayout>
  );
}