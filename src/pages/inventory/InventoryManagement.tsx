import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Package,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  Plus,
  Box,
  Loader2,
  Trash2,
  Ban,
  RotateCcw
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { coreApi } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { getApiErrorMessage } from "@/lib/apiError";
import { showToast, TOAST } from "@/lib/toastMessages";

interface IInventoryItem {
  id: number;
  name: string;
  category: string;
  type: string;
  location: string;
  quantity: number;
  minStock: number;
  supplier: string;
  status: string;
  active: boolean;
}

export default function InventoryManagement() {
  const { success, error: toastError, warning } = useToast();
  const [inventory, setInventory] = useState<IInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDisableConfirmOpen, setIsDisableConfirmOpen] = useState(false);
  const [itemToDisable, setItemToDisable] = useState<{ id: number; name: string } | null>(null);
  const [disabling, setDisabling] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [newPart, setNewPart] = useState({
    name: "",
    category: "",
    type: "RAW",
    location: "",
    quantity: 0,
    minStock: 0,
    supplier: ""
  });

  const navigate = useNavigate();
  const location = useLocation();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await coreApi.get("/inventory");
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleCreatePart = async () => {
    try {
      await coreApi.post("/inventory", newPart);
      showToast(success, TOAST.inventory.itemCreated);
      setIsAddModalOpen(false);
      fetchInventory();
      setNewPart({
        name: "",
        category: "",
        type: "RAW",
        location: "",
        quantity: 0,
        minStock: 0,
        supplier: ""
      });
    } catch (error: any) {
      console.error("Error creating part:", error);
      toastError(TOAST.inventory.createFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    }
  };

  const handleDisable = async (id: number) => {
    try {
      setDisabling(true);
      await coreApi.patch(`/inventory/${id}/disable`);
      showToast(warning, TOAST.inventory.itemDisabled(id));
      fetchInventory();
    } catch (error: any) {
      console.error("Error disabling item:", error);
      toastError(TOAST.inventory.disableFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    } finally {
      setDisabling(false);
    }
  };

  const handleEnable = async (id: number) => {
    try {
      await coreApi.patch(`/inventory/${id}/enable`);
      showToast(success, TOAST.inventory.itemEnabled(id));
      fetchInventory();
    } catch (error: any) {
      console.error("Error enabling item:", error);
      toastError(TOAST.inventory.enableFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    }
  };

  const filteredInventory = inventory.filter(item => 
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.id?.toString() || "").includes(searchTerm) ||
    (item.supplier || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const metrics = {
    total: inventory.length,
    lowStock: inventory.filter(p => p.status === "CRITICAL" || p.quantity <= p.minStock).length,
    healthy: inventory.filter(p => p.status === "NORMAL" && p.quantity > p.minStock).length
  };

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        
        {/* HEADER INDUSTRIAL COM SUBMENU */}
        <div className="flex flex-col gap-6 border-l-[6px] border-red-700 pl-5 py-4 bg-transparent/40 backdrop-blur-sm">
          <div className="flex items-end justify-between">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
                Material Logistics
              </span>
              <div className="flex items-baseline gap-2">
                <h1 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">
                  Inventory
                </h1>
                <span className="text-4xl font-black text-red-600 tracking-tighter leading-none uppercase">
                  Management
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-500 text-[10px] font-black text-white uppercase tracking-widest h-11 px-6 gap-2 shadow-[0_0_15px_rgba(220,38,38,0.4)] border border-red-500/50 transition-all hover:scale-105">
                    <Plus size={16} /> Add New Part
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-black/95 border border-white/10 border-t-4 border-red-600 backdrop-blur-xl shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white flex items-center gap-2">
                      <Box className="text-red-600" size={24} />
                      Register <span className="text-red-600">New Part</span>
                    </DialogTitle>
                    <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Master Data Input // Kizuna Industrial
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-5 py-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-red-500 uppercase ml-1 tracking-widest">Part Name</label>
                        <Input 
                          placeholder="Ex: Hydraulic Gasket" 
                          className="font-bold italic bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors" 
                          value={newPart.name}
                          onChange={(e) => setNewPart({...newPart, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Category</label>
                        <Input 
                          placeholder="Ex: Mechanical" 
                          className="font-bold italic bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors" 
                          value={newPart.category}
                          onChange={(e) => setNewPart({...newPart, category: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Type</label>
                        <Select value={newPart.type} onValueChange={(val) => setNewPart({...newPart, type: val})}>
                          <SelectTrigger className="font-bold italic text-[11px] uppercase bg-white/5 border-white/10 text-white focus:ring-1 focus:ring-red-600 focus:border-red-600 h-10">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-white shadow-[0_0_20px_rgba(220,38,38,0.15)]">
                            <SelectItem value="RAW" className="font-bold uppercase text-[10px]">Raw Material</SelectItem>
                            <SelectItem value="FINISHED" className="font-bold uppercase text-[10px]">Finished Product</SelectItem>
                            <SelectItem value="WASTE" className="font-bold uppercase text-[10px]">Waste</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Supplier</label>
                        <Input 
                          placeholder="Supplier Name" 
                          className="font-bold italic bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors" 
                          value={newPart.supplier}
                          onChange={(e) => setNewPart({...newPart, supplier: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Initial Qty</label>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          className="font-bold bg-white/5 border-white/10 text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors" 
                          value={newPart.quantity || ""}
                          onChange={(e) => setNewPart({...newPart, quantity: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Min Stock</label>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          className="font-bold bg-white/5 border-white/10 text-white text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors" 
                          value={newPart.minStock || ""}
                          onChange={(e) => setNewPart({...newPart, minStock: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Location</label>
                        <Input 
                          placeholder="Ex: WH-01" 
                          className="font-bold italic uppercase bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors text-center" 
                          value={newPart.location}
                          onChange={(e) => setNewPart({...newPart, location: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="border-t border-white/5 pt-6">
                    <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-white">Cancel Action</Button>
                    <Button 
                      className="bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest px-8 shadow-lg shadow-red-900/40"
                      onClick={handleCreatePart}
                    >
                      Authorize Entry
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex gap-1 bg-white/[0.05] border border-white/10 p-1 rounded-lg w-fit shadow-inner">
            <button
              onClick={() => navigate("/inventory")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all
              ${location.pathname === "/inventory" ? "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-white/10" : "text-slate-400 hover:text-white"}`}
            >
              <Package size={14} /> Stock Levels
            </button>
            <button
              onClick={() => navigate("/inventory/movements")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all
              ${location.pathname === "/inventory/movements" ? "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-white/10" : "text-slate-400 hover:text-white"}`}
            >
              <ArrowRightLeft size={14} /> Stock Movements
            </button>
          </div>
        </div>

        {/* CARDS DE RESUMO */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Total Materials", val: metrics.total.toString().padStart(2, '0'), icon: <Package />, color: "text-blue-500", bg: "bg-blue-950/30 border border-blue-900/50 shadow-[0_0_8px_rgba(59,130,246,0.2)]" },
            { label: "Low Stock Items", val: metrics.lowStock.toString().padStart(2, '0'), icon: <AlertTriangle />, color: "text-red-500", bg: "bg-red-950/30 border border-red-900/50 shadow-[0_0_8px_rgba(220,38,38,0.2)]" },
            { label: "Healthy Stock", val: metrics.healthy.toString().padStart(2, '0'), icon: <CheckCircle2 />, color: "text-emerald-500", bg: "bg-emerald-950/30 border border-emerald-900/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]" },
          ].map((card, i) => (
            <Card key={i} className="p-6 flex flex-row items-center gap-4 border-white/10 bg-transparent/40 backdrop-blur-sm">
              <div className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}>{card.icon}</div>
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-black text-white">{card.val}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* TABELA PADRÃO KIZUNA */}
        <Card className="p-0 border-white/10/60 overflow-hidden bg-transparent/40 backdrop-blur-sm">
          <div className="p-4 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Search materials..." 
                className="pl-10 text-[11px] font-bold italic h-9 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-red-500" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Material ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Material Specification</TableHead>
                <TableHead className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Category</TableHead>
                <TableHead className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Stock Level</TableHead>
                <TableHead className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Status</TableHead>
                <TableHead className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Location</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-500 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-red-600" size={32} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accessing Mainframe...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No spectral matches found.</span>
                  </TableCell>
                </TableRow>
              ) : filteredInventory.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="hover:bg-white/[0.02] transition-colors border-white/5"
                >
                  <TableCell>
                    <span className="font-black text-slate-400 italic text-[10px]">#{item.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-bold uppercase tracking-tight text-white">
                        {item.name}
                      </span>
                      <span className="text-[9px] font-black text-red-600 uppercase tracking-tighter opacity-70">
                        {item.supplier || (item.type === "WASTE" ? "Rejeição QC" : "Internal")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-[8px] font-black uppercase border-white/10 bg-white/[0.02] text-slate-300">
                      {item.category || (item.type === "WASTE" ? "DESPERDÍCIO" : "—")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className={`font-black text-sm tracking-tighter ${item.quantity <= item.minStock ? 'text-red-500' : 'text-emerald-500'}`}>
                        {item.quantity.toFixed(0)}
                      </span>
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Min: {item.minStock}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`text-[8px] font-black uppercase px-2 py-0.5 border shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
                        (item.status === "CRITICAL" || item.quantity <= item.minStock)
                            ? "bg-red-950/30 text-red-500 border-red-900/50"
                            : "bg-emerald-950/30 text-emerald-500 border-emerald-900/50"
                      }`}
                    >
                      {item.status || (item.quantity <= item.minStock ? "CRITICAL" : "OK")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold italic text-[10px] text-slate-400 uppercase tracking-tighter">
                      {item.location || (item.type === "WASTE" ? "SETOR DESCARTE" : "—")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    {item.type === "WASTE" ? (
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Sistema</span>
                    ) : item.active ? (
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setItemToDisable({ id: item.id, name: item.name });
                          setIsDisableConfirmOpen(true);
                        }}
                        className="h-8 w-8 text-slate-600 hover:text-red-600 hover:bg-red-600/10 transition-all"
                       >
                        <Ban size={14} />
                       </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEnable(item.id)}
                        className="h-8 w-8 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"
                       >
                        <RotateCcw size={14} />
                       </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <ConfirmModal
          isOpen={isDisableConfirmOpen}
          onClose={() => {
            setIsDisableConfirmOpen(false);
            setItemToDisable(null);
          }}
          onConfirm={() => {
            if (!itemToDisable) return;
            const { id } = itemToDisable;
            void (async () => {
              await handleDisable(id);
              setIsDisableConfirmOpen(false);
              setItemToDisable(null);
            })();
          }}
          title="Deactivate Material"
          description={
            itemToDisable
              ? `Are you sure you want to deactivate "${itemToDisable.name}" (#${itemToDisable.id})? This item will be removed from active stock. This action requires authorization.`
              : "Are you sure you want to deactivate this item? This action requires authorization."
          }
          variant="danger"
          requirePassword={true}
          confirmLabel="Authorize Deactivation"
          loading={disabling}
        />
      </div>
    </MainLayout>
  );
}