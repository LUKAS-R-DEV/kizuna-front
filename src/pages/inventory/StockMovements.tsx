import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  ArrowRightLeft, 
  Package,
  Loader2
} from "lucide-react";
import { coreApi } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { getApiErrorMessage } from "@/lib/apiError";
import { showToast, TOAST } from "@/lib/toastMessages";
import { formatApiDateTime } from "@/lib/datetime";

interface IMovement {
  id: number;
  inventoryId: number;
  inventoryName: string;
  reason: string;
  quantity: number;
  createdAt: string;
  type: "ENTRY" | "EXIT" | "WASTE";
  updatedAt?: string;
}

interface IInventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit?: string;
}

export default function StockMovements() {
  const { success, error: toastError, warning } = useToast();
  const navigate = useNavigate();
  const [movements, setMovements] = useState<IMovement[]>([]);
  const [inventoryList, setInventoryList] = useState<IInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // States for the new movement form
  const [submitting, setSubmitting] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>("");
  const [operationType, setOperationType] = useState<"ENTRY" | "EXIT">("ENTRY");
  const [quantity, setQuantity] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const fetchMovements = async (currentPage: number = page) => {
    try {
      setLoading(true);
      const response = await coreApi.get(`/inventory-movement?page=${currentPage}&size=10`);
      const data = response.data;
      const list = Array.isArray(data) ? data : (data.content ?? []);
      setMovements(list);
      setTotalPages(data.totalPages ?? (list.length > 0 ? 1 : 0));
      setTotalElements(data.totalElements ?? list.length);
    } catch (error) {
      console.error("Error fetching movements:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await coreApi.get("/inventory");
      setInventoryList((response.data || []).filter((item: IInventoryItem & { type?: string }) => item.type !== "WASTE"));
    } catch (error) {
      console.error("Error fetching inventory for dropdown:", error);
    }
  };

  useEffect(() => {
    fetchMovements(page);
  }, [page]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSubmitMovement = async () => {
    if (!selectedInventoryId || !quantity || !reason) {
      showToast(warning, TOAST.inventory.movementMissing);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        inventoryId: parseInt(selectedInventoryId),
        quantity: parseFloat(quantity),
        reason: reason
      };

      const endpoint = operationType === "ENTRY" 
        ? `/inventory/${selectedInventoryId}/movement/entry` 
        : `/inventory/${selectedInventoryId}/movement/exit`;

      await coreApi.post(endpoint, payload);
      
      // Success
      showToast(success, TOAST.inventory.movementPosted);
      setIsMovementModalOpen(false);
      resetForm();
      if (page === 0) {
        fetchMovements(0); // Refresh the list
      } else {
        setPage(0); // Will trigger fetchMovements in useEffect
      }
    } catch (error: any) {
      console.error("Error registering movement:", error);
      toastError(TOAST.inventory.movementFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedInventoryId("");
    setOperationType("ENTRY");
    setQuantity("");
    setReason("");
  };

  const filteredMovements = movements.filter(mov => {
    const itemName = mov.inventoryName || inventoryList.find(i => i.id === mov.inventoryId)?.name || "";
    return itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           mov.id.toString().includes(searchTerm) ||
           mov.reason?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        
        {/* HEADER INDUSTRIAL COM SUBMENU INTEGRADO */}
        <div className="flex flex-col gap-6 border-l-[6px] border-red-700 pl-5 py-4 bg-transparent/40 backdrop-blur-sm">
          <div className="flex items-end justify-between">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
                Audit & Traceability
              </span>
              <div className="flex items-baseline gap-2">
                <h1 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">
                  Stock
                </h1>
                <span className="text-4xl font-black text-red-600 tracking-tighter leading-none uppercase">
                  Movements
                </span>
              </div>
            </div>

            <div className="flex gap-3">

              {/* MODAL DE NOVA MOVIMENTAÇÃO */}
              <Dialog open={isMovementModalOpen} onOpenChange={(open) => {
                setIsMovementModalOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-500 text-[10px] font-black text-white uppercase tracking-widest h-11 px-6 gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-500/50">
                    <ArrowRightLeft size={16} /> Register Movement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px] bg-black/95 border border-white/10 border-t-4 border-blue-600 backdrop-blur-xl shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white">
                      New <span className="text-blue-600">Transaction</span>
                    </DialogTitle>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Stock Entry or Release // Kizuna Log</p>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Selection</label>
                      <Select value={selectedInventoryId} onValueChange={setSelectedInventoryId}>
                        <SelectTrigger className="bg-white/[0.03] border-white/10 text-[11px] font-bold h-11 focus:ring-blue-600">
                          <SelectValue placeholder="Select inventory item..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                          {inventoryList.map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()} className="text-[11px] font-bold uppercase hover:bg-blue-600/20">
                              {item.name} <span className="text-[9px] text-slate-500 ml-2">({item.id})</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type of Flow</label>
                        <Select value={operationType} onValueChange={(val: any) => setOperationType(val)}>
                          <SelectTrigger className="bg-white/[0.03] border-white/10 text-[11px] font-bold h-11 focus:ring-blue-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10">
                            <SelectItem value="ENTRY" className="text-emerald-500 font-bold uppercase text-[10px]">INBOUND (+)</SelectItem>
                            <SelectItem value="EXIT" className="text-amber-500 font-bold uppercase text-[10px]">OUTBOUND (-)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount</label>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="bg-white/[0.03] border-white/10 text-[11px] font-bold h-11 text-white focus-visible:ring-1 focus-visible:ring-blue-600 focus:border-blue-600 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Reason</label>
                      <Input 
                        placeholder="Ex: PO #1234 or Manual Inventory Adjustment" 
                        className="bg-white/[0.03] border-white/10 text-[11px] font-bold h-11 text-white focus-visible:ring-1 focus-visible:ring-blue-600 focus:border-blue-600 transition-colors italic"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                  </div>

                  <DialogFooter className="border-t border-white/5 pt-6 gap-3">
                    <Button variant="ghost" onClick={() => setIsMovementModalOpen(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-white">Abort</Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-500 text-[10px] font-black text-white uppercase tracking-widest h-11 px-8 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                      onClick={handleSubmitMovement}
                      disabled={submitting}
                    >
                      {submitting ? <Loader2 className="animate-spin mr-2" size={14} /> : null}
                      Post Transaction
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* SUBMENU - NAVEGAÇÃO ENTRE PÁGINAS */}
          <div className="flex gap-1 bg-white/[0.05] border border-white/10 p-1 rounded-lg w-fit shadow-inner">
            <button 
              onClick={() => navigate("/inventory")}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 hover:text-white"
            >
              <Package size={14} /> Stock Levels
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-white/10"
            >
              <ArrowRightLeft size={14} /> Stock Movements
            </button>
          </div>
        </div>

        {/* FILTROS TÉCNICOS */}
        <Card className="p-4 flex-row gap-4 items-center border-white/10 bg-transparent/40 backdrop-blur-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              placeholder="Filter by Material, ID or Reason..." 
              className="pl-10 text-[11px] font-bold italic h-10 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-blue-600 focus:border-blue-600 transition-colors" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 gap-2 hover:text-white hover:bg-white/5">
              <Filter size={14} /> More Filters
            </Button>
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <Badge variant="outline" className="bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 shadow-[0_0_8px_rgba(16,185,129,0.2)] text-[9px] font-black uppercase">
              {totalElements} Entries Detected
            </Badge>
          </div>
        </Card>

        {/* TABELA DE MOVIMENTAÇÕES */}
        <Card className="p-0 border-white/10/60 overflow-hidden bg-transparent/40 backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/10">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Entry ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Material Specification</TableHead>
                <TableHead className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Operation</TableHead>
                <TableHead className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Amount</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reason / Document</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-blue-500" size={32} />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Log Sectors...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredMovements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No transaction signals recorded.</span>
                  </TableCell>
                </TableRow>
              ) : filteredMovements.map((mov) => (
                <TableRow key={mov.id} className="hover:bg-white/[0.02] transition-colors border-white/5">
                  <TableCell>
                    <span className="font-black text-slate-400 italic text-[10px]">#{mov.id}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-bold text-white uppercase tracking-tight">
                        {mov.type === "WASTE" && mov.reason?.includes(" — ")
                          ? mov.reason.split(" — ")[0]
                          : (mov.inventoryName || inventoryList.find(i => i.id === mov.inventoryId)?.name || "Material desconhecido")}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-tighter opacity-70 ${mov.type === "WASTE" ? "text-red-600" : "text-blue-600"}`}>
                        {mov.type === "WASTE" ? "Desperdício de produção" : `ID: #${mov.inventoryId}`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className={`mx-auto flex items-center justify-center gap-1.5 w-24 py-1 rounded-md text-[8px] font-black uppercase border shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
                      mov.type === 'ENTRY' 
                      ? 'bg-emerald-950/30 text-emerald-500 border border-emerald-900/50' 
                      : mov.type === 'EXIT'
                      ? 'bg-amber-950/30 text-amber-500 border border-amber-900/50'
                      : 'bg-red-950/30 text-red-500 border border-red-900/50'
                    }`}>
                      {mov.type === 'ENTRY' ? <ArrowDownLeft size={10}/> : mov.type === 'WASTE' ? <ArrowUpRight size={10}/> : <ArrowUpRight size={10}/>}
                      {mov.type === 'WASTE' ? 'WASTE' : mov.type}
                    </div>
                  </TableCell>
                  <TableCell className={`text-center font-black text-sm tracking-tighter ${
                    mov.type === 'ENTRY' ? 'text-emerald-500' : mov.type === 'WASTE' ? 'text-red-500' : 'text-amber-500'
                  }`}>
                    {mov.type === 'ENTRY' || mov.type === 'WASTE' ? '+' : '-'}{mov.quantity.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-[10px] font-medium text-slate-400 italic max-w-[280px] truncate" title={mov.reason}>
                    {mov.type === "WASTE" && mov.reason?.includes(" — ")
                      ? mov.reason.split(" — ").slice(1).join(" — ")
                      : (mov.reason || "Process Automation")}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono text-[10px] text-slate-500 tracking-tighter">
                      {formatApiDateTime(mov.createdAt)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* RODAPÉ TÉCNICO */}
        <div className="flex justify-between items-center bg-transparent border border-white/10 p-4 rounded-xl backdrop-blur-md">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                Live Audit Stream Active <span className="text-slate-500">//</span> Kizuna Industrial Logistics
              </p>
           </div>
           <div className="flex gap-3 items-center">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic mr-4">
               Total Nodes: {totalElements}
             </span>
             <Button
               variant="outline"
               size="sm"
               disabled={page === 0}
               onClick={() => setPage((p) => Math.max(0, p - 1))}
               className="h-7 text-[10px] font-black uppercase px-3 text-slate-300 border-white/10"
             >
               Prev
             </Button>
             <span className="text-[10px] font-black text-slate-400">
               Pg {page + 1} / {totalPages || 1}
             </span>
             <Button
               variant="outline"
               size="sm"
               disabled={page >= totalPages - 1}
               onClick={() => setPage((p) => p + 1)}
               className="h-7 text-[10px] font-black uppercase px-3 text-slate-300 border-white/10"
             >
               Next
             </Button>
           </div>
        </div>
      </div>
    </MainLayout>
  );
}
