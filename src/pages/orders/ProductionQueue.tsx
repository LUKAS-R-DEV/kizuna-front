import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Clock, Calendar, Package, Loader2, AlertCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { coreApi } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { getApiErrorMessage } from "@/lib/apiError";
import { TOAST } from "@/lib/toastMessages";

interface ProductionOrder {
  id: number;
  recipeName: string;
  quantityToProduce: number;
  priority: number;
  deadline?: string;
  estimatedTotalTime: number;
  status: string;
  queuePosition?: number;
}

export default function ProductionQueue() {
  const { error: toastError } = useToast();
  const [queue, setQueue] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const response = await coreApi.get<ProductionOrder[]>("/production-order/queue");
      // Use queuePosition for sorting if available, otherwise use priority as fallback
      const sorted = response.data.sort((a, b) => {
        if (a.queuePosition !== undefined && b.queuePosition !== undefined) {
          return a.queuePosition - b.queuePosition;
        }
        return b.priority - a.priority;
      });
      setQueue(sorted);
    } catch (error) {
      console.error("Failed to fetch production queue", error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(queue);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setQueue(items);

    try {
      // Backend expects: moveOrder(Long id, int position)
      // Note: position is likely 0-based or 1-based, we'll try to match it.
      await coreApi.put(`/production-order/${reorderedItem.id}/reorder`, null, {
        params: { position: result.destination.index }
      });
    } catch (error: any) {
      console.error("Failed to sync queue order", error);
      toastError(TOAST.orders.queueSyncFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
      fetchQueue();
    }
  };

  const getPriorityStyle = (priority: number) => {
    if (priority >= 3) return "bg-red-950/30 text-red-500 border border-red-900/50 shadow-[0_0_8px_rgba(220,38,38,0.2)]";
    if (priority === 2) return "bg-amber-950/30 text-amber-500 border border-amber-900/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]";
    return "bg-emerald-950/30 text-emerald-500 border border-emerald-900/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]";
  };

  const highPriorityCount = queue.filter(q => q.priority >= 3).length;
  const mediumPriorityCount = queue.filter(q => q.priority === 2).length;
  const lowPriorityCount = queue.filter(q => q.priority === 1).length;

  return (
    <MainLayout>
      <div className="px-8 pb-12 space-y-8 mt-[-14px]">
        
        {/* HEADER */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-transparent/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
              Sequence Optimization
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">
                Production
              </h1>
              <span className="text-4xl font-black text-red-600 tracking-tighter uppercase leading-none">
                Queue
              </span>
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-5 flex flex-col justify-center border-white/10 bg-transparent/40 backdrop-blur-sm group hover:border-blue-500/30 transition-all">
            <span className="text-[10px] font-black text-slate-500 mb-1 uppercase tracking-[0.2em] group-hover:text-blue-500/70">Total in Queue</span>
            <span className="text-3xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{queue.length.toString().padStart(2, '0')}</span>
          </Card>
          <Card className="p-5 flex flex-col justify-center border-white/10 bg-transparent/40 backdrop-blur-sm group hover:border-red-500/30 transition-all">
            <span className="text-[10px] font-black text-slate-500 mb-1 uppercase tracking-[0.2em] group-hover:text-red-500/70">High Priority</span>
            <span className="text-3xl font-black text-red-600 tracking-tighter drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]">{highPriorityCount.toString().padStart(2, '0')}</span>
          </Card>
          <Card className="p-5 flex flex-col justify-center border-white/10 bg-transparent/40 backdrop-blur-sm group hover:border-amber-500/30 transition-all">
            <span className="text-[10px] font-black text-slate-500 mb-1 uppercase tracking-[0.2em] group-hover:text-amber-500/70">Normal Priority</span>
            <span className="text-3xl font-black text-amber-500 tracking-tighter drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">{mediumPriorityCount.toString().padStart(2, '0')}</span>
          </Card>
          <Card className="p-5 flex flex-col justify-center border-white/10 bg-transparent/40 backdrop-blur-sm group hover:border-emerald-500/30 transition-all">
            <span className="text-[10px] font-black text-slate-500 mb-1 uppercase tracking-[0.2em] group-hover:text-emerald-500/70">Low Priority</span>
            <span className="text-3xl font-black text-emerald-600 tracking-tighter drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{lowPriorityCount.toString().padStart(2, '0')}</span>
          </Card>
        </div>

        {/* DRAG & DROP QUEUE LIST */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
             <Loader2 className="animate-spin text-red-600" size={48} />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Synchronizing Industrial Sequence...</p>
          </div>
        ) : queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
            <AlertCircle size={48} className="text-slate-700 mb-4" />
            <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">No pending batches</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">All scheduled production units have been processed.</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="production-queue">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef} 
                  className="space-y-4"
                >
                  {Array.isArray(queue) && queue.map((item, index) => (
                    <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group bg-slate-900/40 backdrop-blur-md flex items-start gap-5 p-6 rounded-2xl transition-all duration-300 border ${
                            snapshot.isDragging 
                              ? "border-red-500 shadow-2xl shadow-red-900/20 scale-[1.02] z-50 cursor-grabbing bg-slate-900" 
                              : "border-white/10 hover:border-white/20 hover:bg-white/[0.03]"
                          }`}
                        >
                          {/* LEFT COLUMN: Drag Handle & Position Index */}
                          <div className="flex flex-col items-center gap-3 w-8 shrink-0 relative mt-1">
                            <div 
                              {...provided.dragHandleProps}
                              className="text-slate-600 hover:text-red-500 cursor-grab active:cursor-grabbing hover:bg-white/[0.05] p-1.5 rounded-md transition-colors"
                            >
                              <GripVertical size={20} />
                            </div>
                            <div className="w-7 h-7 rounded-full bg-blue-950/30 text-blue-500 border border-blue-900/50 shadow-[0_0_8px_rgba(59,130,246,0.2)] flex items-center justify-center text-[12px] font-black shadow-inner">
                              {index + 1}
                            </div>
                          </div>

                          {/* RIGHT COLUMN: Full Data Content */}
                          <div className="flex-1 flex flex-col gap-6">
                            
                            {/* Top Row: ID, Name, Badge */}
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <h3 className="text-lg font-black text-white leading-none italic uppercase tracking-tighter">
                                  PO-#{item.id.toString().padStart(4, '0')}
                                </h3>
                                <p className="text-[13px] font-bold text-slate-400 tracking-tight">{item.recipeName}</p>
                              </div>
                              <Badge variant="outline" className={`!text-[11px] !font-black !px-4 !py-1 uppercase ${getPriorityStyle(item.priority)}`}>
                                {item.priority >= 3 ? "Urgent" : item.priority === 2 ? "High" : "Normal"}
                              </Badge>
                            </div>

                            {/* Data columns (Quantidade, Duração, Status) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                              <div>
                                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                                  <Package size={14} />
                                  <span className="text-[10px] font-black uppercase tracking-wide">Output Quantity</span>
                                </div>
                                <p className="text-sm font-black text-slate-300">{item.quantityToProduce} <span className="text-[10px] text-slate-600 uppercase">Units</span></p>
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                                  <Clock size={14} />
                                  <span className="text-[10px] font-black uppercase tracking-wide">Estimated Cycle</span>
                                </div>
                                <p className="text-sm font-black text-slate-300">{item.estimatedTotalTime} <span className="text-[10px] text-slate-600 uppercase">Min</span></p>
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                                  <Calendar size={14} />
                                  <span className="text-[10px] font-black uppercase tracking-wide">Planned Deadline</span>
                                </div>
                                <p className="text-sm font-black text-slate-300 italic">{item.deadline ? new Date(item.deadline).toLocaleDateString('en-US') : 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

      </div>
    </MainLayout>
  );
}