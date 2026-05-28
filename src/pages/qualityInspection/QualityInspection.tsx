import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { coreApi } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { getApiErrorMessage } from "@/lib/apiError";
import { showToast, TOAST } from "@/lib/toastMessages";
import { 
  ShieldCheck, History, CheckCircle2, XCircle, 
  MessageSquare, Timer, Search, AlertTriangle,
  RotateCcw, Info, Box
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface ProductionOrder {
  id: number;
  recipeName: string;
  quantityToProduce: number;
  priority: number;
  status: string;
}

interface QualityInspection {
  id: number;
  productionOrderName: string;
  status: string;
  notes: string;
  inspectedBy: string;
  createdAt: string;
}

export default function QualityInspection() {
  const { success, error: toastError, warning } = useToast();
  const [pendingBatches, setPendingBatches] = useState<ProductionOrder[]>([]);
  const [history, setHistory] = useState<QualityInspection[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<ProductionOrder | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  // Confirm Modal States
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
    variant: "info" | "danger" | "warning" | "success";
    requirePassword?: boolean;
    confirmLabel?: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
    variant: "info"
  });

  const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, historyRes] = await Promise.all([
        coreApi.get<ProductionOrder[]>("/production-order/status/WAITING_INSPECTION"),
        coreApi.get<QualityInspection[]>("/quality-inspection")
      ]);
      setPendingBatches(Array.isArray(pendingRes.data) ? pendingRes.data : []);
      setHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
      
      if (Array.isArray(pendingRes.data) && pendingRes.data.length > 0 && !selectedBatch) {
        setSelectedBatch(pendingRes.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch quality data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInspect = async (status: string) => {
    if (!selectedBatch) return;
    try {
      await coreApi.post("/quality-inspection", {
        productionOrderId: selectedBatch.id,
        status,
        notes
      });
      
      if (status === 'APPROVED') {
        showToast(success, TOAST.quality.approved(selectedBatch.id));
      } else {
        showToast(warning, TOAST.quality.flagged(selectedBatch.id, status));
      }

      setNotes("");
      setSelectedBatch(null);
      fetchData();
    } catch (error: any) {
      console.error("Failed to submit inspection", error);
      toastError(TOAST.quality.submitFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    }
  };

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        {/* HEADER KIZUNA STANDARD */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-transparent/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-red-600 animate-pulse rounded-full" />
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em]">
                Quality Assurance & Compliance
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                Quality
              </h1>
              <span className="text-4xl font-black text-red-600 tracking-tighter uppercase leading-none">
                Inspection
              </span>
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              placeholder="SEARCH BATCH ID..." 
              className="pl-9 pr-4 h-11 bg-white/[0.03] border border-white/10 rounded-md text-[10px] font-black uppercase tracking-widest outline-none w-64 focus:ring-1 ring-red-500/50 transition-all text-white" 
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* AGUARDANDO INSPEÇÃO */}
            <section className="bg-transparent rounded-xl border border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer size={16} className="text-amber-500" />
                  <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Batches Awaiting Inspection ({pendingBatches.length})
                  </h2>
                </div>
                <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/5 text-[9px] font-black uppercase">Pending Approval</Badge>
              </div>
              <div className="p-4 space-y-3">
                {pendingBatches.length > 0 ? pendingBatches.map((batch) => (
                  <div 
                    key={batch.id} 
                    onClick={() => setSelectedBatch(batch)}
                    className={`p-5 rounded-xl transition-all border cursor-pointer group ${
                      selectedBatch?.id === batch.id 
                      ? 'border-red-600/50 bg-red-600/5 shadow-[0_0_15px_rgba(220,38,38,0.1)]' 
                      : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className={`text-[10px] font-black italic ${selectedBatch?.id === batch.id ? 'text-red-500' : 'text-slate-500'}`}>
                          UNIT-ID: PO-#{batch.id.toString().padStart(4, '0')}
                        </span>
                        <h3 className="text-lg font-black uppercase leading-none text-white tracking-tighter italic">
                          {batch.recipeName}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                          <Box size={10} /> QTY: {batch.quantityToProduce} UNITS
                          <span className="text-slate-600">|</span> 
                          OPERATIONAL PRIORITY: P{batch.priority}
                        </p>
                      </div>
                      <Badge className={`${
                        batch.priority >= 3 
                        ? 'bg-red-950/30 text-red-500 border border-red-900/50' 
                        : 'bg-white/[0.05] text-slate-400 border border-white/10'
                      } font-black text-[9px] px-3 uppercase`}>
                        {batch.priority >= 3 ? 'Urgent' : 'Standard'}
                      </Badge>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 border border-dashed border-white/5 rounded-xl">
                    <CheckCircle2 size={32} className="text-slate-700" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">All batches cleared for production</p>
                  </div>
                )}
              </div>
            </section>

            {/* HISTÓRICO */}
            <section className="bg-transparent rounded-xl border border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/[0.01] flex items-center gap-2">
                <History size={16} className="text-slate-500" />
                <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Compliance History</h2>
              </div>
              <div className="divide-y divide-white/5">
                {history.length > 0 ? history.map((item) => (
                  <div key={item.id} className="p-5 flex items-start justify-between hover:bg-white/[0.01] transition-colors">
                    <div className="space-y-3 flex-1 mr-8">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-red-600 italic tracking-tighter">INS-#{item.id.toString().padStart(4, '0')}</span>
                        <h4 className="text-xs font-black text-white uppercase tracking-tight">{item.productionOrderName}</h4>
                        <span className="text-[9px] font-bold text-slate-600 uppercase">{new Date(item.createdAt).toLocaleDateString('en-US')}</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-400 bg-white/[0.02]/50 p-3 rounded border border-white/5 shadow-inner">
                        <MessageSquare size={14} className="text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-[11px] italic font-bold leading-relaxed">"{item.notes || 'No technical notes provided.'}"</p>
                          <p className="text-[9px] uppercase font-black text-slate-600 mt-1">— INSPECTOR: {item.inspectedBy}</p>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${
                      item.status === 'APPROVED' ? 'bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]' : 
                      item.status === 'REWORK' ? 'bg-orange-950/30 text-orange-500 border border-orange-900/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]' :
                      'bg-red-950/30 text-red-500 border border-red-900/50 shadow-[0_0_8px_rgba(220,38,38,0.2)]'
                    } font-black text-[9px] uppercase px-3 italic`}>
                      {item.status}
                    </Badge>
                  </div>
                )) : (
                  <p className="text-[10px] text-center py-8 text-slate-600 font-bold uppercase tracking-[0.2em]">Compliance logs empty</p>
                )}
              </div>
            </section>
          </div>

          {/* INSPECTION PANEL */}
          <div className="col-span-12 lg:col-span-4 sticky top-6">
            <div className="bg-transparent rounded-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-md">
              <div className="bg-slate-900/80 p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-red-600 animate-pulse" />
                  <h2 className="text-[11px] font-black uppercase text-white tracking-[0.2em] italic">Technical Terminal</h2>
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                </div>
              </div>
              <div className="p-6 space-y-6">
                {selectedBatch ? (
                  <>
                    <div className="p-5 bg-white/[0.03] rounded-lg border border-white/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Box size={40} className="text-white" />
                      </div>
                      <p className="text-[9px] font-black text-red-500 uppercase mb-2 tracking-widest border-b border-red-500/20 pb-1 inline-block">Active Selection</p>
                      <p className="text-3xl font-black text-white tracking-tighter italic leading-none mb-1">UNIT-#{selectedBatch.id}</p>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-tight">{selectedBatch.recipeName}</p>
                      <div className="mt-4 flex gap-4">
                         <div className="flex flex-col">
                           <span className="text-[8px] font-black text-slate-600 uppercase">Quantity</span>
                           <span className="text-xs font-bold text-white">{selectedBatch.quantityToProduce} UN</span>
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[8px] font-black text-slate-600 uppercase">Priority</span>
                           <span className="text-xs font-bold text-white">LEVEL {selectedBatch.priority}</span>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <MessageSquare size={12} /> Technical Notes
                        </label>
                        <span className="text-[8px] font-bold text-slate-700 uppercase italic">Encrypted Connection Active</span>
                      </div>
                      <Textarea 
                        placeholder="ENTER VALIDATION LOGS..." 
                        className="min-h-[140px] bg-slate-950 border-white/10 text-white text-[11px] font-bold italic focus:border-red-600/50 transition-all resize-none"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <Button 
                        onClick={() => setConfirmState({
                          isOpen: true,
                          title: "Approve Batch",
                          description: `You are about to release PO-#${selectedBatch.id} for final logistics. This action certifies compliance and is irreversible without supervisor override.`,
                          variant: "success",
                          requirePassword: true,
                          confirmLabel: "Authorize Release",
                          action: () => handleInspect('APPROVED')
                        })}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[10px] tracking-[0.2em] h-14 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-500/50 transition-all active:scale-[0.98]"
                      >
                        <CheckCircle2 size={18} className="mr-2" /> Approve Batch
                      </Button>
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          onClick={() => setConfirmState({
                            isOpen: true,
                            title: "Request Rework",
                            description: `Flag Batch PO-#${selectedBatch.id} for non-compliance? It will be returned to the production queue for mandatory corrective action.`,
                            variant: "warning",
                            requirePassword: true,
                            confirmLabel: "Authorize Rework",
                            action: () => handleInspect('REWORK')
                          })}
                          variant="outline" 
                          className="border-orange-500/30 bg-orange-950/20 text-orange-500 hover:bg-orange-900/30 font-black uppercase text-[10px] tracking-widest h-12 italic"
                        >
                          <RotateCcw size={16} className="mr-2" /> Rework
                        </Button>
                        <Button 
                          onClick={() => setConfirmState({
                            isOpen: true,
                            title: "Reject Batch",
                            description: `CRITICAL: Marking PO-#${selectedBatch.id} as REJECTED will flag the units as waste. This action requires high-level security clearance.`,
                            variant: "danger",
                            requirePassword: true,
                            confirmLabel: "Authorize Rejection",
                            action: () => handleInspect('REJECTED')
                          })}
                          variant="outline" 
                          className="border-red-600/30 bg-red-950/20 text-red-600 hover:bg-red-900/30 font-black uppercase text-[10px] tracking-widest h-12 italic"
                        >
                          <XCircle size={16} className="mr-2" /> Reject
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 px-6 border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                    <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5 shadow-inner">
                      <Search size={32} className="text-slate-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Scanner Offline</h3>
                      <p className="text-[10px] font-bold text-slate-600 mt-2 leading-relaxed">SELECT A PRODUCTION UNIT FROM THE QUEUE TO INITIALIZE TECHNICAL VALIDATION.</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-red-950/20 p-4 border-t border-white/5 flex items-start gap-3">
                 <Info size={16} className="text-red-700 mt-0.5" />
                 <p className="text-[9px] font-bold text-red-900 leading-tight italic uppercase tracking-tighter">
                   Critical: Approval grants immediate release to shipping. Rejection flags unit as waste and notifies planning.
                 </p>
              </div>
            </div>
          </div>
        </div>
        
        <ConfirmModal
          isOpen={confirmState.isOpen}
          onClose={closeConfirm}
          onConfirm={() => {
            confirmState.action();
            closeConfirm();
          }}
          title={confirmState.title}
          description={confirmState.description}
          variant={confirmState.variant}
          requirePassword={confirmState.requirePassword}
          confirmLabel={confirmState.confirmLabel}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
}