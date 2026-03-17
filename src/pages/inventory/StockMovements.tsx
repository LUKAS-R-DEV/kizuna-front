import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Assumindo que você usa react-router
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
import { Search, History, Download, ArrowUpRight, ArrowDownLeft, Filter, ArrowRightLeft, Package } from "lucide-react";
import { MOVEMENTS_MOCK } from "@/mocks/stockMovements";
import { INVENTORY_MOCK } from "@/mocks/inventory";

export default function StockMovements() {
  const navigate = useNavigate();
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        
        {/* HEADER INDUSTRIAL COM SUBMENU INTEGRADO */}
        <div className="flex flex-col gap-6 border-l-[6px] border-red-700 pl-5 py-4 bg-white/40 backdrop-blur-sm">
          <div className="flex items-end justify-between">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
                Audit & Traceability
              </span>
              <div className="flex items-baseline gap-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                  Stock
                </h1>
                <span className="text-3xl font-thin text-slate-300 tracking-tighter uppercase leading-none">
                  Movements
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-200 h-11 px-6 gap-2 hover:bg-slate-100">
                <Download size={14} /> Export History
              </Button>

              {/* MODAL DE NOVA MOVIMENTAÇÃO */}
              <Dialog open={isMovementModalOpen} onOpenChange={setIsMovementModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-[10px] font-black text-white uppercase tracking-widest h-11 px-6 gap-2 shadow-lg shadow-blue-900/20">
                    <ArrowRightLeft size={16} /> Register Movement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px] bg-white border-t-[6px] border-blue-600">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">
                      New <span className="text-blue-600">Transaction</span>
                    </DialogTitle>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Entry or Release // Kizuna Log</p>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Material Specification</label>
                      <Select>
                        <SelectTrigger className="font-bold italic border-slate-200">
                          <SelectValue placeholder="Select from inventory..." />
                        </SelectTrigger>
                        <SelectContent>
                          {INVENTORY_MOCK.map((item) => (
                            <SelectItem key={item.id} value={item.id} className="font-bold uppercase text-[10px]">
                              {item.id} - {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Operation Type</label>
                        <Select>
                          <SelectTrigger className="font-bold italic border-slate-200">
                            <SelectValue placeholder="Type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IN" className="text-emerald-600 font-black text-[10px]">INBOUND (+)</SelectItem>
                            <SelectItem value="OUT" className="text-red-600 font-black text-[10px]">OUTBOUND (-)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Amount</label>
                        <Input type="number" placeholder="0.00" className="font-bold italic border-slate-200" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Reason / Reference Document</label>
                      <Input placeholder="Ex: PO #1234 or Maintenance Request" className="font-bold italic border-slate-200" />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsMovementModalOpen(false)} className="text-[10px] font-black uppercase">Cancel</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest px-8 shadow-md" onClick={() => setIsMovementModalOpen(false)}>Post Transaction</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* SUBMENU - NAVEGAÇÃO ENTRE PÁGINAS */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
            <button 
              onClick={() => navigate("/inventory")} // Rota da sua tela de Inventory
              className="flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all text-slate-500 hover:text-slate-700"
            >
              <Package size={14} /> Stock Levels
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all bg-white text-slate-900 shadow-sm"
            >
              <ArrowRightLeft size={14} /> Stock Movements
            </button>
          </div>
        </div>

        {/* FILTROS TÉCNICOS */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input placeholder="Filter by Material, ID or Operator..." className="pl-10 text-[11px] font-bold italic h-10 border-slate-200" />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-500 gap-2">
              <Filter size={14} /> More Filters
            </Button>
            <div className="h-8 w-[1px] bg-slate-100 mx-2" />
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] font-black uppercase">Latest 100 Entries</Badge>
          </div>
        </div>

        {/* TABELA DE MOVIMENTAÇÕES */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="text-[9px] font-black uppercase pl-6 h-12">Entry ID</TableHead>
                <TableHead className="text-[9px] font-black uppercase">Material Specification</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-center">Operation</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-center">Amount</TableHead>
                <TableHead className="text-[9px] font-black uppercase">Authorized By</TableHead>
                <TableHead className="text-[9px] font-black uppercase">Reason / Document</TableHead>
                <TableHead className="text-[9px] font-black uppercase pr-6 text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOVEMENTS_MOCK.map((mov) => (
                <TableRow key={mov.id} className="group hover:bg-slate-50 transition-colors border-b border-slate-50/50">
                  <TableCell className="pl-6 font-black text-slate-400 italic text-[10px]">{mov.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{mov.materialName}</span>
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">{mov.materialId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className={`mx-auto flex items-center justify-center gap-1.5 w-24 py-1.5 rounded-md text-[8px] font-black uppercase border ${
                      mov.type === 'IN' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {mov.type === 'IN' ? <ArrowDownLeft size={10}/> : <ArrowUpRight size={10}/>}
                      {mov.type === 'IN' ? 'Inbound' : 'Outbound'}
                    </div>
                  </TableCell>
                  <TableCell className={`text-center font-black text-sm tracking-tighter ${mov.type === 'IN' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {mov.quantity}
                  </TableCell>
                  <TableCell className="text-[10px] font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black">
                        {mov.user.charAt(0)}
                      </div>
                      {mov.user}
                    </div>
                  </TableCell>
                  <TableCell className="text-[10px] font-medium text-slate-400 italic max-w-[200px] truncate">
                    {mov.reason}
                  </TableCell>
                  <TableCell className="text-right pr-6 font-mono text-[10px] text-slate-500">
                    {mov.timestamp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* RODAPÉ TÉCNICO */}
        <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl shadow-inner">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Live Audit Stream Active <span className="text-slate-700">//</span> Kizuna Industrial Logistics
              </p>
           </div>
           <div className="flex gap-1">
             <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black text-slate-500 uppercase hover:text-white">Prev</Button>
             <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black text-red-600 uppercase hover:bg-red-600/10">Next Page</Button>
           </div>
        </div>
      </div>
    </MainLayout>
  );
}