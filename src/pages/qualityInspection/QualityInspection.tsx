import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_QUALITY_BATCHES, MOCK_QUALITY_HISTORY } from "../../mocks/quality";
import { 
  ShieldCheck, History, CheckCircle2, XCircle, 
  MessageSquare, Timer, Search 
} from "lucide-react";

export default function QualityInspection() {
  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        {/* HEADER KIZUNA STANDARD */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-white/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">Quality Assurance & Compliance</span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Quality</h1>
              <span className="text-4xl font-black text-red-600 tracking-tighter uppercase leading-none">Inspection</span>
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-800" size={14} />
            <input placeholder="SEARCH BATCH ID..." className="pl-9 pr-4 h-11 bg-white border border-slate-200 rounded-md text-[10px] font-black uppercase tracking-widest outline-none w-64 focus:ring-2 ring-red-500/20" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* AGUARDANDO INSPEÇÃO - PUXANDO DO MOCK */}
            <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2">
                <Timer size={16} className="text-amber-500" />
                <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                  Batches Awaiting Inspection ({MOCK_QUALITY_BATCHES.length})
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {MOCK_QUALITY_BATCHES.map((batch) => (
                  <div key={batch.id} className={`p-5 rounded-xl transition-all border ${batch.status === 'Pending' ? 'border-2 border-blue-600 shadow-md bg-white' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className={`text-[10px] font-black italic ${batch.status === 'Pending' ? 'text-blue-600' : 'text-slate-800'}`}>{batch.id}</span>
                        <h3 className={`text-lg font-black uppercase leading-none ${batch.status === 'Pending' ? 'text-slate-900' : 'text-slate-800'}`}>{batch.productName}</h3>
                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest mt-1">
                          PO: {batch.poNumber} <span className="mx-2">|</span> QTY: {batch.quantity} UNITS
                        </p>
                      </div>
                      <Badge className={`${batch.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'} border-none font-black text-[9px] px-3 uppercase`}>
                        {batch.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* HISTÓRICO - PUXANDO DO MOCK */}
            <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-50 flex items-center gap-2">
                <History size={16} className="text-slate-800" />
                <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-700">Recent History</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {MOCK_QUALITY_HISTORY.map((item) => (
                  <div key={item.id} className="p-5 flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-900 italic">{item.id}</span>
                        <h4 className="text-xs font-black text-slate-700 uppercase">{item.productName}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                        <MessageSquare size={12} className="text-slate-800" />
                        <p className="text-[11px] italic font-bold">"{item.notes}" — <span className="text-[9px] uppercase font-black">{item.inspector}</span></p>
                      </div>
                    </div>
                    <Badge className={`${item.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} border-none font-black text-[9px] uppercase px-3`}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* INSPECTION PANEL (FIXO/STIKY) */}
          <div className="col-span-12 lg:col-span-4 sticky top-6">
            <div className="bg-white rounded-xl border border-slate-100 shadow-lg overflow-hidden">
              <div className="bg-slate-900 p-4 flex items-center gap-2">
                <ShieldCheck size={16} className="text-red-600" />
                <h2 className="text-[11px] font-black uppercase text-white tracking-widest">Inspection Panel</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[9px] font-black text-slate-800 uppercase mb-1 tracking-widest">Current Selection</p>
                  <p className="text-xl font-black text-slate-900 tracking-tighter italic leading-none">{MOCK_QUALITY_BATCHES[0].id}</p>
                  <p className="text-xs font-bold text-slate-800 uppercase mt-1">{MOCK_QUALITY_BATCHES[0].productName}</p>
                </div>
                <Textarea placeholder="ENTER TECHNICAL NOTES..." className="min-h-[120px] bg-slate-50 text-xs font-bold italic" />
                <div className="space-y-3">
                  <Button className="w-full bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest h-12">Approve Batch</Button>
                  <Button variant="outline" className="w-full border-slate-200 text-red-600 font-black uppercase text-[10px] tracking-widest h-12">Reject Batch</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}