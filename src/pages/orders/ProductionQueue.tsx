import { useState } from "react";
import { Card } from "@/components/ui/card";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Clock, Calendar, Package } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { PRODUCTION_QUEUE_MOCK, IProductionOrder } from "@/mocks/productionOrderQueue";

export default function ProductionQueue() {
  const [queue, setQueue] = useState<IProductionOrder[]>(PRODUCTION_QUEUE_MOCK);

  // Reorder logic
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(queue);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const updatedQueue = items.map((item, index) => ({
      ...item,
      position: index + 1,
    }));
    setQueue(updatedQueue);
  };

  const getPriorityStyle = (priority: string) => {
    const styles: Record<string, string> = {
      High: "bg-red-50 text-red-600 border-red-200",
      Medium: "bg-amber-50 text-amber-600 border-amber-300",
      Low: "bg-emerald-50 text-emerald-600 border-emerald-200",
    };
    return styles[priority] || "";
  };

  const highPriorityCount = queue.filter(q => q.priority === "High").length;
  const mediumPriorityCount = queue.filter(q => q.priority === "Medium").length;
  const lowPriorityCount = queue.filter(q => q.priority === "Low").length;

  return (
    <MainLayout>
      <div className="px-8 pb-12 space-y-8 mt-[-14px]">
        
        {/* HEADER */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-white/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">
              Sequence Optimization
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                Production
              </h1>
              <span className="text-4xl font-black text-red-600 tracking-tighter uppercase leading-none">
                Queue
              </span>
            </div>
          </div>
        </div>

        {/* TOP BUTTONS - SORTING */}
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border-none !rounded-2xl shadow-none">
            Ordenar por Prioridade
          </Button>
          <Button variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border-none !rounded-2xl shadow-none">
            Ordenar por Prazo
          </Button>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-5 flex flex-col justify-center border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="text-[11px] font-bold text-slate-700 mb-1">Total na Fila</span>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">{queue.length}</span>
          </Card>
          <Card className="p-5 flex flex-col justify-center border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="text-[11px] font-bold text-slate-700 mb-1">Alta Prioridade</span>
            <span className="text-3xl font-black text-red-600 tracking-tighter">{highPriorityCount}</span>
          </Card>
          <Card className="p-5 flex flex-col justify-center border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="text-[11px] font-bold text-slate-700 mb-1">Média Prioridade</span>
            <span className="text-3xl font-black text-amber-500 tracking-tighter">{mediumPriorityCount}</span>
          </Card>
          <Card className="p-5 flex flex-col justify-center border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="text-[11px] font-bold text-slate-700 mb-1">Baixa Prioridade</span>
            <span className="text-3xl font-black text-emerald-600 tracking-tighter">{lowPriorityCount}</span>
          </Card>
        </div>

        {/* DRAG & DROP QUEUE LIST */}
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
                        className={`group bg-white flex items-start gap-5 p-6 !rounded-2xl transition-all duration-300 ${
                          snapshot.isDragging 
                            ? "border-2 border-red-500 shadow-2xl shadow-red-900/20 scale-[1.02] z-50 cursor-grabbing" 
                            : "border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-slate-300"
                        }`}
                      >
                        {/* LEFT COLUMN: Drag Handle & Position Index */}
                        <div className="flex flex-col items-center gap-3 w-8 shrink-0 relative mt-1">
                          <div 
                            {...provided.dragHandleProps}
                            className="text-slate-700 hover:text-red-500 cursor-grab active:cursor-grabbing hover:bg-slate-50 p-1.5 rounded-md transition-colors"
                          >
                            <GripVertical size={20} />
                          </div>
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[12px] font-black shadow-inner shadow-blue-500/10">
                            {index + 1}
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Full Data Content */}
                        <div className="flex-1 flex flex-col gap-6">
                          
                          {/* Top Row: ID, Name, Badge */}
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="text-lg font-black text-slate-900 leading-none">{item.id}</h3>
                              <p className="text-[13px] font-bold text-slate-800 tracking-tight">{item.product}</p>
                            </div>
                            <Badge variant="outline" className={`!text-[11px] !font-black !px-4 !py-1 ${getPriorityStyle(item.priority)}`}>
                              {item.priority}
                            </Badge>
                          </div>

                          {/* Data columns (Quantidade, Duração, Prazo) */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                            <div>
                              <div className="flex items-center gap-1.5 text-slate-800 mb-1">
                                <Package size={14} />
                                <span className="text-[10px] font-black uppercase tracking-wide">Quantidade</span>
                              </div>
                              <p className="text-sm font-black text-slate-800">{item.quantity}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 text-slate-800 mb-1">
                                <Clock size={14} />
                                <span className="text-[10px] font-black uppercase tracking-wide">Duração Est.</span>
                              </div>
                              <p className="text-sm font-black text-slate-800">{item.duration}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 text-slate-800 mb-1">
                                <Calendar size={14} />
                                <span className="text-[10px] font-black uppercase tracking-wide">Prazo</span>
                              </div>
                              <p className="text-sm font-black text-slate-800">{item.deadline}</p>
                            </div>
                          </div>

                          {/* Requirements Below (Materials) */}
                          <div className="pt-2">
                            <span className="text-[10px] font-bold uppercase text-slate-800 tracking-widest block mb-2">Materiais Necessários:</span>
                            <div className="flex flex-wrap gap-2">
                              {item.materials?.map(m => (
                                <span key={m} className="bg-slate-100 text-slate-800 text-[10px] font-bold px-3 py-1 rounded-md tracking-tight hover:bg-slate-200 transition-colors cursor-default">
                                  {m}
                                </span>
                              ))}
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

      </div>
    </MainLayout>
  );
}