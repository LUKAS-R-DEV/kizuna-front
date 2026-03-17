import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Clock, Calendar, Info, PlayCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { PRODUCTION_QUEUE_MOCK, IProductionOrder } from "@/mocks/productionOrderQueue";

export default function ProductionQueue() {
  const [queue, setQueue] = useState<IProductionOrder[]>(PRODUCTION_QUEUE_MOCK);

  // Função para reordenar a lista após o arraste
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(queue);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Atualiza a posição visual (opcional, dependendo do seu mock)
    const updatedQueue = items.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    setQueue(updatedQueue);
  };

  const getPriorityStyle = (priority: string) => {
    const styles: Record<string, string> = {
      High: "bg-red-50 text-red-700 border-red-100",
      Medium: "bg-amber-50 text-amber-700 border-amber-100",
      Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
    return styles[priority] || "";
  };

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        
        {/* CABEÇALHO INDUSTRIAL */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-white/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
              Sequence Optimization
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                Production
              </h1>
              <span className="text-3xl font-thin text-slate-300 tracking-tighter uppercase leading-none">
                Queue
              </span>
            </div>
          </div>
        </div>

        {/* TIP OPERACIONAL */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
          <Info size={18} className="text-blue-500 mt-0.5" />
          <p className="text-[11px] font-bold text-blue-700 uppercase tracking-tight">
            Tip: Drag items by the handle to reorder the queue. Position determines execution order.
          </p>
        </div>

        {/* ÁREA DE ARRASTE */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="production-queue">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef} 
                className="space-y-4"
              >
                {queue.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{ ...provided.draggableProps.style }}
                        className={`group bg-white border ${
                          snapshot.isDragging ? "border-red-500 shadow-2xl scale-[1.02]" : "border-slate-100"
                        } rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-6`}
                      >
                        {/* HANDLE DE ARRASTE - Única parte que inicia o movimento */}
                        <div 
                          {...provided.dragHandleProps}
                          className="text-slate-300 hover:text-red-500 cursor-grab active:cursor-grabbing p-2"
                        >
                          <GripVertical size={24} />
                        </div>

                        {/* CONTEÚDO PRINCIPAL */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-slate-900 tracking-tighter italic">{item.id}</span>
                              <h3 className="text-lg font-bold text-slate-700 tracking-tight">{item.product}</h3>
                            </div>
                            <Badge className={`text-[10px] font-black uppercase px-3 py-1 ${getPriorityStyle(item.priority)}`}>
                              {item.priority}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-slate-500">
                              <Clock size={14} className="text-slate-400" />
                              <span className="text-[11px] font-bold uppercase tracking-tighter text-nowrap">
                                Start: {item.startTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                              <PlayCircle size={14} className="text-slate-400" />
                              <span className="text-[11px] font-bold uppercase tracking-tighter">
                                {item.duration}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                              <Calendar size={14} className="text-slate-400" />
                              <span className="text-[11px] font-bold uppercase tracking-tighter">
                                {item.deadline}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-black text-slate-400 uppercase italic">
                                Pos: {index + 1}
                              </span>
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

        <div className="flex justify-center pt-4">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
            Kizuna Industrial System // End of Queue
          </p>
        </div>
      </div>
    </MainLayout>
  );
}