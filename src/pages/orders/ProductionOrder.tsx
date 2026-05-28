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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, ShieldCheck, ClipboardList, Calendar, Loader2, Clock, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { coreApi, iamApi } from "@/lib/api";
import { getRoles } from "@/lib/auth";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Timer } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { getApiErrorMessage } from "@/lib/apiError";
import { showToast, TOAST } from "@/lib/toastMessages";
import { filterStrictOperators, getOperatorLabel, type OperatorUser } from "@/lib/operators";
import { formatApiDateTime } from "@/lib/datetime";

interface ProductionOrder {
  id: number;
  recipeName: string;
  quantityToProduce: number;
  priority: number;
  status: string;
  startTime?: string;
  endTime?: string;
  progress: number;
  deadline?: string;
  operatorName: string;
  operatorId: string;
  estimatedTotalTime: number;
  eta?: string;
  remainingTime?: number;
  queuePosition?: number;
  calculatedStatus?: string;
}

interface Recipe {
  id: number;
  name: string;
}

type User = OperatorUser;

export default function ProductionOrders() {
  const { success, error: toastError, warning } = useToast();
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Role checking
  const userRoles = getRoles().map(r => r.toUpperCase());
  const isOperatorOnly = userRoles.includes("OPERATOR") && !userRoles.includes("ADMIN") && !userRoles.includes("PLANNER");
  const isPlannerOrAdmin = userRoles.includes("PLANNER") || userRoles.includes("ADMIN");
  
  // Estados para Criação
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [operators, setOperators] = useState<User[]>([]);
  const [newOrder, setNewOrder] = useState({
    recipeId: "",
    quantityToProduce: 1,
    priority: 1,
    operatorId: "",
    deadline: ""
  });

  // Estados para Visualização
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Estados para Cancelamento
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchMetadata();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await coreApi.get<ProductionOrder[]>("/production-order");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch production orders", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [recipesRes, usersRes] = await Promise.all([
        coreApi.get<Recipe[]>("/recipes"),
        iamApi.get<User[]>("/users/allOperators", { headers: { "X-Skip-403-Redirect": "1" } })
      ]);
      setRecipes(Array.isArray(recipesRes.data) ? recipesRes.data : []);
      setOperators(
        Array.isArray(usersRes.data) ? filterStrictOperators(usersRes.data) : []
      );
    } catch (error) {
      console.error("Failed to fetch metadata", error);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newOrder.recipeId || !newOrder.operatorId) {
        showToast(warning, TOAST.orders.missingFields);
        return;
      }
      const payload = {
        ...newOrder,
        recipeId: parseInt(newOrder.recipeId),
        deadline: newOrder.deadline || null
      };

      await coreApi.post("/production-order", payload);
      showToast(success, TOAST.orders.created);
      setIsCreateOpen(false);
      setNewOrder({
        recipeId: "",
        quantityToProduce: 1,
        priority: 1,
        operatorId: "",
        deadline: ""
      });
      fetchOrders();
    } catch (error: any) {
      console.error("Error creating order:", error);
      toastError(TOAST.orders.createFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    }
  };

  const handleCancelOrder = async (id: number) => {
    try {
      setLoading(true);
      await coreApi.post(`/production-order/${id}/cancel`);
      showToast(success, TOAST.orders.cancelled(id));
      fetchOrders();
    } catch (error: any) {
      console.error("Cancellation grid error:", error);
      toastError(TOAST.orders.cancelFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      "IN_PROGRESS": "bg-blue-950/30 text-blue-500 border border-blue-900/50 shadow-[0_0_8px_rgba(59,130,246,0.2)]",
      "PLANNED": "bg-amber-950/30 text-amber-500 border border-amber-900/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]",
      "WAITING_INSPECTION": "bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
      "FINISHED_BY_TIME": "bg-emerald-950/30 text-emerald-500 border border-emerald-900/50",
      "APPROVED": "bg-emerald-500 text-white border-none",
      "CANCELLED": "bg-red-950/30 text-red-500 border border-red-900/50 shadow-[0_0_8px_rgba(220,38,38,0.2)]",
      "REWORK": "bg-orange-950/30 text-orange-500 border border-orange-900/50",
    };
    return styles[status] || "bg-slate-900 text-slate-400";
  };

  const getPriorityStyle = (priority: number) => {
    if (priority >= 3) return "bg-red-950/30 text-red-500 border border-red-900/50 font-black";
    if (priority === 2) return "bg-amber-950/30 text-amber-500 border border-amber-900/50 font-black";
    return "bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 font-black";
  };

  const filteredOrders = orders.filter(o => 
    o.recipeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.id.toString().includes(searchTerm)
  );

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        
        {/* HEADER */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-transparent/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">Operational Logistics</span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">Production</h1>
              <span className="text-4xl font-black text-red-600 tracking-tighter uppercase leading-none">Orders</span>
            </div>
          </div>

          {/* MODAL CRIAR ORDEM */}
          {!isOperatorOnly && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-md px-6 shadow-lg shadow-red-200/50 flex items-center gap-2 transition-all hover:scale-105 uppercase tracking-widest">
                <Plus size={18} strokeWidth={3} /> CREATE NEW ORDER
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md border-t-4 border-red-600 bg-black/95 backdrop-blur-xl border-white/10 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
              <DialogHeader>
                <DialogTitle className="text-xl font-black tracking-tighter uppercase italic">New Production Order</DialogTitle>
                <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Register Operational Task</DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateOrder} className="space-y-4 py-2 italic font-medium">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Recipe / Product</label>
                  <Select value={newOrder.recipeId} onValueChange={(v) => setNewOrder({...newOrder, recipeId: v})}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-11">
                      <SelectValue placeholder="Select Recipe" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      {recipes.map(recipe => (
                        <SelectItem key={recipe.id} value={recipe.id.toString()}>{recipe.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Quantity</label>
                    <Input 
                      required 
                      type="number"
                      value={newOrder.quantityToProduce}
                      onChange={(e) => setNewOrder({...newOrder, quantityToProduce: parseInt(e.target.value)})}
                      className="bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Priority</label>
                    <Select value={newOrder.priority.toString()} onValueChange={(v) => setNewOrder({...newOrder, priority: parseInt(v)})}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="1">Low</SelectItem>
                        <SelectItem value="2">Medium</SelectItem>
                        <SelectItem value="3">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Assign Operator</label>
                  <Select value={newOrder.operatorId} onValueChange={(v) => setNewOrder({...newOrder, operatorId: v})}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-11">
                      <SelectValue placeholder="Select Operator" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      {Array.isArray(operators) && operators.map(op => (
                        <SelectItem key={op.keycloakId} value={op.keycloakId}>
                          {getOperatorLabel(op)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Deadline (Optional)</label>
                  <Input 
                    type="datetime-local"
                    value={newOrder.deadline}
                    onChange={(e) => setNewOrder({...newOrder, deadline: e.target.value})}
                    className="bg-white/5 border-white/10 h-11 text-white focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors"
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-6 shadow-[0_0_15px_rgba(220,38,38,0.3)]">Emit Order</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          )}
        </div>

        {/* TABELA */}
        <Card className="p-0 border-white/10 overflow-hidden bg-transparent/40 backdrop-blur-sm">
          <div className="p-4 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <Input 
                placeholder="Search orders..." 
                className="pl-10 bg-white/5 border-white/10 italic font-medium text-white focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck size={16} className="text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.4)]" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500/80">Operational Integrity</span>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow>
                <TableHead className="text-slate-500 font-black uppercase text-[10px]">Order ID</TableHead>
                <TableHead className="text-slate-500 font-black uppercase text-[10px]">Recipe / Product</TableHead>
                <TableHead className="text-slate-500 font-black uppercase text-[10px]">Quantity</TableHead>
                <TableHead className="text-center text-slate-500 font-black uppercase text-[10px]">Progress</TableHead>
                <TableHead className="text-center text-slate-500 font-black uppercase text-[10px]">Status</TableHead>
                <TableHead className="text-center text-slate-500 font-black uppercase text-[10px]">Priority</TableHead>
                <TableHead className="text-right text-slate-500 font-black uppercase text-[10px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <Loader2 className="animate-spin text-red-600 mx-auto" size={32} />
                    <p className="text-[10px] font-black text-slate-500 uppercase mt-2">Connecting to Logistics Grid...</p>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-slate-500 font-black uppercase text-[10px]">No orders found in archive</TableCell>
                </TableRow>
              ) : filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-white/[0.02] border-white/5 transition-colors">
                  <TableCell>
                    <span className="font-black text-white italic text-[10px]">PO-#{order.id.toString().padStart(4, '0')}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 font-bold text-slate-400 text-sm">
                      <ClipboardList size={14} className="text-red-500/50" />
                      {order.recipeName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-400 font-black text-sm">{order.quantityToProduce} <span className="text-[10px] text-slate-600">UNITS</span></span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                       <span className="text-[10px] font-black text-white italic">{(order.progress || 0).toFixed(0)}%</span>
                       <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
                         <div 
                           className="h-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)] transition-all" 
                           style={{ width: `${order.progress || 0}%` }} 
                         />
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`text-[9px] font-black uppercase px-2 py-0.5 ${getStatusStyle(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`text-[9px] uppercase px-2 py-0.5 ${getPriorityStyle(order.priority)}`}>
                      {order.priority >= 3 ? 'Urgent' : order.priority === 2 ? 'High' : 'Normal'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-blue-500 font-black text-[10px] gap-2 hover:bg-blue-500/10"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsViewOpen(true);
                        }}
                      >
                        <Eye size={14} /> VIEW
                      </Button>
                      {isPlannerOrAdmin && order.status === 'PLANNED' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-red-500 font-black text-[10px] gap-2 hover:bg-red-500/10"
                          onClick={() => {
                            setOrderToCancel(order.id);
                            setIsCancelConfirmOpen(true);
                          }}
                        >
                          <Trash2 size={14} /> CANCEL
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* MODAL DE VISUALIZAÇÃO */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-md border-t-4 border-blue-600 bg-black/95 backdrop-blur-xl border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
            <DialogHeader>
              <DialogTitle className="text-xl font-black tracking-tighter uppercase flex items-center gap-2 italic">
                <ClipboardList className="text-blue-600" /> PO-#{selectedOrder?.id.toString().padStart(4, '0')}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-widest underline underline-offset-4">Technical Specifications</DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="py-4 space-y-6">
                <div className="grid grid-cols-2 gap-6 bg-white/[0.02] p-4 rounded-lg border border-white/5 shadow-inner">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Recipe Name</span>
                    <p className="font-bold text-white tracking-tight leading-tight">{selectedOrder.recipeName}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Target Quantity</span>
                    <p className="font-bold text-white tracking-tight leading-tight">{selectedOrder.quantityToProduce} UNITS</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Production Status</span>
                    <Badge variant="outline" className={`text-[8px] font-black h-5 uppercase ${getStatusStyle(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Assigned Operator</span>
                    <p className="font-bold text-slate-300 italic">{selectedOrder.operatorName}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Production Progress</span>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[10px] font-black italic">
                        <span className="text-white">{(selectedOrder.progress || 0).toFixed(1)}%</span>
                        {selectedOrder.eta && (
                          <span className="text-red-500 flex items-center gap-1">
                            <Clock size={10} /> ETA: {formatApiDateTime(selectedOrder.eta)}
                          </span>
                        )}
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all" 
                          style={{ width: `${selectedOrder.progress || 0}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 col-span-2 pt-2 border-t border-white/5">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Timing Information</span>
                    <div className="grid grid-cols-2 gap-4 font-bold text-slate-400 italic text-xs">
                      <div className="flex items-center gap-1.5"><Timer size={12} className="text-red-500" /> Start: {selectedOrder.startTime ? formatApiDateTime(selectedOrder.startTime) : 'PENDING'}</div>
                      {selectedOrder.deadline && <div className="flex items-center gap-1.5"><Calendar size={12} className="text-red-500" /> Deadline: {formatApiDateTime(selectedOrder.deadline, { dateStyle: 'short', timeStyle: 'short' })}</div>}
                      {selectedOrder.remainingTime && <div className="flex items-center gap-1.5 col-span-2"><Clock size={12} className="text-blue-500" /> Rem. Time: {Math.floor(selectedOrder.remainingTime / 60)}h {Math.floor(selectedOrder.remainingTime % 60)}m</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setIsViewOpen(false)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest border border-white/5">Close Documentation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmModal
          isOpen={isCancelConfirmOpen}
          onClose={() => setIsCancelConfirmOpen(false)}
          onConfirm={() => {
            if (orderToCancel) handleCancelOrder(orderToCancel);
            setIsCancelConfirmOpen(false);
          }}
          title="Revoke Production Order"
          description={`Are you sure you want to terminate PO-#${orderToCancel?.toString().padStart(4, '0')}? This action is irreversible.`}
          variant="danger"
          requirePassword={true}
          confirmLabel="Authorize Revocation"
          loading={loading}
        />

      </div>
    </MainLayout>
  );
}