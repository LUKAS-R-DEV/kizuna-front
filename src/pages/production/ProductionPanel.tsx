import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  CheckCircle2, 
  Info, 
  Timer, 
  Box, 
  ListOrdered, 
  Plus, 
  Trash2, 
  AlertTriangle,
  RotateCcw,
  Calendar,
  Pause
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { coreApi, iamApi } from "@/lib/api";
import { getRoles, getToken } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/contexts/ToastContext";
import { getApiErrorMessage } from "@/lib/apiError";
import { showToast, TOAST } from "@/lib/toastMessages";
import { filterStrictOperators, type OperatorUser } from "@/lib/operators";
import { formatApiDateTime } from "@/lib/datetime";
import { formatRemainingMinutes } from "@/lib/formatRemainingTime";

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
  remainingTime?: number | string;
  queuePosition?: number;
}

interface Recipe {
  id: number;
  name: string;
  active?: boolean;
}

type User = OperatorUser;

export default function ProductionPanel() {
  const { success, error: toastError, warning, info } = useToast();
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [operators, setOperators] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [newOrder, setNewOrder] = useState({
    recipeId: "",
    quantityToProduce: 1,
    priority: 1,
    operatorId: "",
    deadline: ""
  });

  // Role checking
  const userRoles = getRoles().map(r => r.toUpperCase());
  const isOperatorOnly = userRoles.includes("OPERATOR") && !userRoles.includes("ADMIN") && !userRoles.includes("PLANNER");

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
    fetchRecipesAndUsers();

    const wsUrl = `${window.location.origin}/api-core/ws-production`;
    const socket = new SockJS(wsUrl);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.debug('[PROD-REALTIME] ' + str);
        }
      },
      onConnect: () => {
        console.info('[PROD-REALTIME] Connected to Production Relay. Listening for signals...');
        
        client.subscribe('/topic/production', (message) => {
          try {
            const update = JSON.parse(message.body);
            console.debug('[PROD-REALTIME] Tactical update received:', update);
            
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.id === update.orderId
                  ? {
                      ...order,
                      progress: update.progress ?? order.progress,
                      remainingTime: update.remainingTime ?? order.remainingTime,
                      eta: update.eta ?? order.eta,
                      status: update.status ?? order.status,
                    }
                  : order
              )
            );
          } catch (e) {
            console.error('[PROD-REALTIME] Signal decoding error:', e);
          }
        });
      },
      onStompError: (frame) => {
        console.error('[PROD-REALTIME] Relay failure: ' + frame.headers['message']);
      }
    });

    client.activate();

    return () => {
      console.info('[PROD-REALTIME] Terminating relay connection.');
      client.deactivate();
    };
  }, []);

  const fetchData = async () => {
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

  const fetchRecipesAndUsers = async () => {
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
      console.error("Failed to fetch recipes or users", error);
    }
  };

  const handleStart = async (id: number) => {
    try {
      await coreApi.post(`/production-order/${id}/start`);
      showToast(success, TOAST.production.started);
      fetchData();
    } catch (error: any) {
      toastError(TOAST.production.startFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    }
  };

  const handleFinish = async (id: number) => {
    try {
      await coreApi.post(`/production-order/${id}/finish`);
      showToast(success, TOAST.production.finished);
      fetchData();
    } catch (error: any) {
      console.error("Logistics error on termination", error);
      toastError(TOAST.production.finishFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await coreApi.post(`/production-order/${id}/cancel`);
      showToast(warning, TOAST.production.cancelled(id));
      fetchData();
    } catch (error: any) {
      console.error("System bypass prohibited", error);
      toastError(TOAST.production.cancelFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    }
  };

  const handleRework = async (id: number) => {
    try {
      await coreApi.post(`/production-order/${id}/rework`);
      showToast(info, TOAST.production.reworkStarted);
      fetchData();
    } catch (error: any) {
      console.error("Manual rework override failed", error);
      toastError(TOAST.production.reworkFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    }
  };

  const handlePause = async (id: number) => {
    try {
      await coreApi.post(`/production-order/${id}/pause`);
      showToast(warning, TOAST.production.paused(id));
      fetchData();
    } catch (error: any) {
      console.error("Emergency stop malfunction", error);
      toastError(TOAST.production.pauseFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    }
  };

  const handleResume = async (id: number) => {
    try {
      await coreApi.post(`/production-order/${id}/resume`);
      showToast(success, TOAST.production.resumed(id));
      fetchData();
    } catch (error: any) {
      console.error("Resume malfunction", error);
      toastError(TOAST.production.resumeFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    }
  };

  const handleCreateOrder = async () => {
    try {
      if (!newOrder.recipeId || !newOrder.operatorId) {
        showToast(warning, TOAST.production.createMissing);
        return;
      }
      const payload = {
        ...newOrder,
        recipeId: parseInt(newOrder.recipeId),
        deadline: newOrder.deadline || null
      };
      await coreApi.post("/production-order", payload);
      showToast(success, TOAST.production.created);
      setIsCreateModalOpen(false);
      setNewOrder({
        recipeId: "",
        quantityToProduce: 1,
        priority: 1,
        operatorId: "",
        deadline: ""
      });
      fetchData();
    } catch (error: any) {
      console.error("Failed to create production order", error);
      toastError(TOAST.production.createFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    }
  };

  // Prioritize active statuses, then the first PLANNED order according to queuePosition and priority
  const activeOrder = orders.find(o => ["IN_PROGRESS", "REWORK", "PAUSED"].includes(o.status)) || 
                      [...orders].filter(o => o.status === "PLANNED")
                        .sort((a, b) => {
                          if (a.queuePosition !== b.queuePosition) return (a.queuePosition || 999) - (b.queuePosition || 999);
                          return b.priority - a.priority;
                        })[0];

  const queue = orders.filter(o => o.status === "PLANNED" && o.id !== activeOrder?.id)
                     .sort((a, b) => {
                       if (a.queuePosition !== b.queuePosition) return (a.queuePosition || 999) - (b.queuePosition || 999);
                       return b.priority - a.priority;
                     });

  const stats = {
    completed: orders.filter(o => ["WAITING_INSPECTION", "APPROVED", "FINISHED_BY_TIME"].includes(o.status)).length,
    inProgress: orders.filter(o => o.status === "IN_PROGRESS" || o.status === "REWORK").length,
    paused: orders.filter(o => o.status === "PAUSED").length,
    pending: orders.filter(o => o.status === "PLANNED").length
  };

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        {/* HEADER */}
        <div className="flex items-end justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-transparent/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-red-600 animate-pulse rounded-full" />
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em]">
                System Monitoring
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">
                Production
              </h1>
              <span className="text-4xl font-black text-red-600 tracking-tighter leading-none uppercase">
                Panel
              </span>
            </div>
          </div>

        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* COLUNA ESQUERDA: ORDEM ATIVA */}
            <div className="lg:col-span-2 space-y-6">
              {activeOrder ? (
                <div className="bg-transparent border border-white/5 rounded-xl p-8 shadow-[0_4px_15px_rgba(0,0,0,0.3)] relative overflow-hidden">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        {activeOrder.status === 'PLANNED' ? 'Pending Production Order' : 'Active Production Order'}
                      </span>
                      <h2 className="text-3xl font-black text-white italic tracking-tighter">PO-#{activeOrder.id.toString().padStart(4, '0')}</h2>
                    </div>
                    <Badge variant="outline" className={`border-2 font-black uppercase text-[10px] px-3 ${
                      activeOrder.status === 'IN_PROGRESS' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' :
                      activeOrder.status === 'REWORK' ? 'border-orange-500 text-orange-500 bg-orange-500/10' :
                      activeOrder.status === 'PAUSED' ? 'border-amber-500 text-amber-500 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.3)]' :
                      'border-blue-500 text-blue-500 bg-blue-500/10'
                    }`}>
                      {activeOrder.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12 mb-10 border-y border-white/5 py-8">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Recipe Name</span>
                      <p className="text-sm font-bold text-slate-200 tracking-tight">{activeOrder.recipeName}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Priority</span>
                      <div>
                        <Badge className={`font-black uppercase text-[8px] ${
                          activeOrder.priority >= 3 ? 'bg-red-950/30 text-red-500 border border-red-900/50' :
                          activeOrder.priority === 2 ? 'bg-orange-950/30 text-orange-500 border border-orange-900/50' :
                          'bg-blue-950/30 text-blue-500 border border-blue-900/50'
                        }`}>
                          {activeOrder.priority >= 3 ? 'Urgent' : activeOrder.priority === 2 ? 'High' : 'Normal'}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Quantity</span>
                      <p className="text-sm font-bold text-slate-200 tracking-tight">
                        {activeOrder.quantityToProduce} <span className="text-slate-600 ml-0.5">UNITS</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ETA / Completion</span>
                      <div className="flex items-center gap-2 text-emerald-500 font-bold italic text-sm">
                        <Timer size={14} /> {activeOrder.eta ? formatApiDateTime(activeOrder.eta) : 'Calculating...'}
                      </div>
                    </div>
                  </div>

                  {/* PROGRESSO */}
                  <div className="space-y-3 mb-10 p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Operational Pulse</span>
                        <span className="text-[9px] font-bold text-slate-600 italic">
                          Remaining Time: {formatRemainingMinutes(activeOrder.remainingTime)}
                          {activeOrder.status === "PAUSED" ? " (paused)" : ""}
                        </span>
                      </div>
                      <span className="text-2xl font-black text-white tracking-tighter italic">{(activeOrder.progress || 0).toFixed(1)}%</span>
                    </div>
                    <div className="relative h-2 w-full bg-slate-900 overflow-hidden rounded-full border border-white/10">
                      <div 
                        className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                        style={{ width: `${activeOrder.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* CONTROLES */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {activeOrder.status === 'PLANNED' ? (
                      <>
                        <Button 
                          onClick={() => setConfirmState({
                            isOpen: true,
                            title: "Initialize Batch",
                            description: `Are you sure you want to start production for PO-#${activeOrder.id.toString().padStart(4, '0')}? This will consume inventory materials.`,
                            variant: "success",
                            action: () => handleStart(activeOrder.id)
                          })}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest py-8 gap-3 shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-500/50 md:col-span-2"
                        >
                          <Play size={20} fill="currentColor" /> Start Production
                        </Button>
                        {!isOperatorOnly && (
                          <Button 
                            onClick={() => setConfirmState({
                              isOpen: true,
                              title: "Revoke Order",
                              description: `CRITICAL: You are about to terminate PO-#${activeOrder.id.toString().padStart(4, '0')}. This action is irreversible and requires authorization.`,
                              variant: "danger",
                              requirePassword: true,
                              confirmLabel: "Authorize Revocation",
                              action: () => handleCancel(activeOrder.id)
                            })}
                            variant="outline" 
                            className="bg-red-950/20 hover:bg-red-900/30 border-red-900/30 text-red-500 font-black uppercase tracking-widest py-8 gap-3"
                          >
                            <Trash2 size={20} /> Cancel
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button 
                          onClick={() => setConfirmState({
                            isOpen: true,
                            title: "Finish Production",
                            description: `Verify that all units for PO-#${activeOrder.id.toString().padStart(4, '0')} are correctly processed before concluding.`,
                            variant: "info",
                            requirePassword: true,
                            confirmLabel: "Authorize Completion",
                            action: () => handleFinish(activeOrder.id)
                          })}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-8 gap-3 md:col-span-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                        >
                          <CheckCircle2 size={20} /> Finish Production
                        </Button>
                        {activeOrder.status === 'PAUSED' ? (
                          <Button 
                            onClick={() => handleResume(activeOrder.id)}
                            className="bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-widest py-8 gap-3 shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-500/50"
                          >
                            <Play size={20} fill="currentColor" /> Resume
                          </Button>
                        ) : activeOrder.status === 'REWORK' ? (
                          <Button 
                            onClick={() => setConfirmState({
                              isOpen: true,
                              title: "Initiate Rework",
                              description: `You are starting a rework cycle for PO-#${activeOrder.id.toString().padStart(4, '0')}. Resources will be re-allocated.`,
                              variant: "warning",
                              action: () => handleRework(activeOrder.id)
                            })}
                            variant="outline" 
                            className="bg-orange-950/20 hover:bg-orange-900/30 border-orange-900/30 text-orange-500 font-black uppercase tracking-widest py-8 gap-3"
                          >
                            <RotateCcw size={20} /> Start Rework
                          </Button>
                        ) : (
                           <Button 
                            onClick={() => setConfirmState({
                              isOpen: true,
                              title: "Suspend Operations",
                              description: `Emergency Pause: Suspend all active procedures for PO-#${activeOrder.id.toString().padStart(4, '0')}?`,
                              variant: "warning",
                              action: () => handlePause(activeOrder.id)
                            })}
                            variant="outline" 
                            className="bg-amber-950/20 hover:bg-amber-900/30 border-amber-900/30 text-amber-500 font-black uppercase tracking-widest py-8 gap-3"
                           >
                            <Pause size={20} /> Pause
                           </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-transparent border border-white/5 border-dashed rounded-xl p-16 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="bg-white/5 p-6 rounded-full">
                    <Box size={48} className="text-slate-600" />
                  </div>
                  <div className="max-w-xs">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">No Active Orders</h3>
                    <p className="text-xs font-bold text-slate-500">Pick an order from the queue or create a new one to begin production.</p>
                  </div>
                </div>
              )}

              {/* INSTRUÇÕES */}
              <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-6 flex items-start gap-4">
                <Info className="text-blue-500 mt-1" size={20} />
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Operational Instructions</h4>
                  <p className="text-xs font-bold text-blue-600/80 leading-relaxed italic">
                    Follow standard operating procedures for the selected recipe. Production starting will automatically consume the required raw materials from inventory. If materials are insufficient, operation will be blocked.
                  </p>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: FILA E RESUMO */}
            <div className="space-y-6">
              {/* FILA DE PRODUÇÃO */}
              <div className="bg-transparent border border-white/5 rounded-xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                  <ListOrdered size={18} className="text-slate-300" />
                  <h3 className="text-sm font-black text-white uppercase tracking-tighter">Production Queue</h3>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {queue.length > 0 ? queue.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/[0.02] transition-colors relative group">
                      <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-300">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-blue-600 italic tracking-tighter">ID: PO-{item.id.toString().padStart(3, '0')}</p>
                        <p className="text-xs font-bold text-slate-400 truncate">{item.recipeName}</p>
                        <p className="text-[10px] font-black text-slate-600">Qty: {item.quantityToProduce}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className={`text-[8px] font-black uppercase ${
                          item.priority >= 3 ? 'text-red-500 border-red-500/30' : 'text-slate-400 border-white/10'
                        }`}>
                          P{item.priority}
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <p className="text-[10px] text-center py-8 text-slate-600 italic font-bold">Queue is currently empty</p>
                  )}
                </div>
              </div>

              {/* RESUMO DO DIA */}
              <div className="bg-transparent border border-white/5 rounded-xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                 <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                  <Box size={18} className="text-slate-300" />
                  <h3 className="text-sm font-black text-white uppercase tracking-tighter">Operational Summary</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-lg shadow-inner">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Completed / Waiting</span>
                    <span className="text-sm font-black text-emerald-500 tracking-tighter">{stats.completed} Orders</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-950/20 border border-blue-900/30 rounded-lg shadow-inner">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active Operations</span>
                    <span className="text-sm font-black text-blue-500 tracking-tighter">{stats.inProgress} Units</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-950/20 border border-amber-900/30 rounded-lg shadow-inner">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Paused Operations</span>
                    <span className="text-sm font-black text-amber-500 tracking-tighter">{stats.paused} Units</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/[0.03] border border-white/5 rounded-lg shadow-inner">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending in Queue</span>
                    <span className="text-sm font-black text-slate-400 tracking-tighter">{stats.pending} Orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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