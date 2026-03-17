// src/pages/orders/ProductionOrders.tsx
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
import { Plus, Search, Eye, ShieldCheck, ClipboardList, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PRODUCTION_ORDERS_MOCK, IProductionOrder } from "@/mocks/productionData";

export default function ProductionOrders() {
  const [orders, setOrders] = useState<IProductionOrder[]>(PRODUCTION_ORDERS_MOCK);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados para Criação
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ product: "", quantity: "", priority: "Medium" as const });

  // Estados para Visualização
  const [selectedOrder, setSelectedOrder] = useState<IProductionOrder | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Handlers
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order: IProductionOrder = {
      id: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      product: newOrder.product,
      quantity: `${newOrder.quantity} units`,
      status: "Pending",
      priority: newOrder.priority,
      deadline: new Date().toISOString().split('T')[0],
      operator: "Current User"
    };
    setOrders([order, ...orders]);
    setIsCreateOpen(false);
    setNewOrder({ product: "", quantity: "", priority: "Medium" });
  };

  const getStatusBadge = (status: IProductionOrder["status"]) => {
    const styles = {
      "In Production": "bg-blue-50 text-blue-600 border-blue-100",
      "Pending": "bg-amber-50 text-amber-600 border-amber-100",
      "Completed": "bg-emerald-50 text-emerald-600 border-emerald-100",
      "Cancelled": "bg-red-50 text-red-600 border-red-100",
    };
    return styles[status];
  };

  const getPriorityBadge = (priority: IProductionOrder["priority"]) => {
    const styles = {
      High: "bg-red-100 text-red-700 font-black",
      Medium: "bg-amber-100 text-amber-700 font-black",
      Low: "bg-emerald-100 text-emerald-700 font-black",
    };
    return styles[priority];
  };

  const filteredOrders = orders.filter(o => 
    o.product.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        
        {/* HEADER */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-white/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">Operational Logistics</span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">Production</h1>
              <span className="text-3xl font-thin text-slate-300 tracking-tighter uppercase leading-none">Orders</span>
            </div>
          </div>

          {/* MODAL CRIAR ORDEM */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-md px-6 shadow-lg shadow-red-200/50 flex items-center gap-2 transition-all hover:scale-105">
                <Plus size={18} strokeWidth={3} /> CREATE NEW ORDER
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md border-t-4 border-red-600">
              <DialogHeader>
                <DialogTitle className="text-xl font-black tracking-tighter uppercase italic">New Production Order</DialogTitle>
                <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Register Operational Task</DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateOrder} className="space-y-4 py-2 italic font-medium">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Product Description</label>
                  <Input 
                    required 
                    value={newOrder.product}
                    onChange={(e) => setNewOrder({...newOrder, product: e.target.value})}
                    placeholder="E.g. Hydraulic Pump X1" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Quantity</label>
                    <Input 
                      required 
                      type="number"
                      value={newOrder.quantity}
                      onChange={(e) => setNewOrder({...newOrder, quantity: e.target.value})}
                      placeholder="0" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Priority</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                      value={newOrder.priority}
                      onChange={(e) => setNewOrder({...newOrder, priority: e.target.value as any})}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-6">Emit Order</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABELA */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Search orders..." 
                className="pl-10 bg-white italic font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck size={16} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Operational Integrity</span>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase pl-8 h-12">Order ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Product</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Quantity</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-center">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-center">Priority</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="group hover:bg-slate-50/80 transition-colors">
                  <TableCell className="pl-8 font-black text-slate-900 italic">{order.id}</TableCell>
                  <TableCell className="font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <ClipboardList size={14} className="text-slate-400" />
                      {order.product}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 font-medium text-sm">{order.quantity}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`text-[9px] font-black uppercase px-2 py-0.5 ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`text-[9px] uppercase px-2 py-0.5 ${getPriorityBadge(order.priority)}`}>
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-blue-600 font-black text-[10px] gap-2 hover:bg-blue-50"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsViewOpen(true);
                      }}
                    >
                      <Eye size={14} /> VIEW
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* MODAL DE VISUALIZAÇÃO */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-md border-t-4 border-blue-600">
            <DialogHeader>
              <DialogTitle className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
                <ClipboardList className="text-blue-600" /> {selectedOrder?.id}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest underline underline-offset-4">Technical Specifications</DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="py-4 space-y-6">
                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Product</span>
                    <p className="font-bold text-slate-800 tracking-tight leading-tight">{selectedOrder.product}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Quantity</span>
                    <p className="font-bold text-slate-800 tracking-tight leading-tight">{selectedOrder.quantity}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Deadline</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-600 italic">
                      <Calendar size={12} /> {selectedOrder.deadline}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Assigned Operator</span>
                    <p className="font-bold text-slate-800 italic">{selectedOrder.operator}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center border-l-2 border-slate-200 pl-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Current Process Status</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={`text-[10px] font-black uppercase ${getStatusBadge(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setIsViewOpen(false)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest">Close Documentation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </MainLayout>
  );
}