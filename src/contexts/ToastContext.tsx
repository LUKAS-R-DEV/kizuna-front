import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translateMessage } from '@/lib/translateMessage';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextData {
  toast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 11);
    const normalizedMessage = translateMessage(message);
    
    // Default durations: Success/Info 5s, Warning 8s, Error 12s
    const duration = type === 'error' ? 12000 : type === 'warning' ? 8000 : 5000;
    
    setToasts((prev) => [...prev.slice(-3), { id, type, title, message: normalizedMessage, duration }]); // Keep max 4 toasts

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const success = (title: string, message?: string) => addToast('success', title, message);
  const error = (title: string, message?: string) => addToast('error', title, message);
  const warning = (title: string, message?: string) => addToast('warning', title, message);
  const info = (title: string, message?: string) => addToast('info', title, message);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, warning, info }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-[85px] right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) => {
  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="text-emerald-500" size={18} />,
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/90',
          accent: 'bg-emerald-500',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
          textColor: 'text-emerald-400'
        };
      case 'error':
        return {
          icon: <AlertCircle className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" size={18} />,
          border: 'border-red-600/60',
          bg: 'bg-red-950/90',
          accent: 'bg-red-600',
          glow: 'shadow-[0_0_30px_rgba(239,68,68,0.45)]',
          textColor: 'text-red-400'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="text-amber-500" size={18} />,
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/90',
          accent: 'bg-amber-500',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
          textColor: 'text-amber-400'
        };
      default:
        return {
          icon: <Info className="text-blue-500" size={18} />,
          border: 'border-blue-500/40',
          bg: 'bg-blue-950/90',
          accent: 'bg-blue-500',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.35)]',
          textColor: 'text-blue-400'
        };
    }
  };

  const style = getStyle();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9, skewX: -5 }}
      animate={{ opacity: 1, x: 0, scale: 1, skewX: 0 }}
      exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto relative flex w-[380px] flex-col border backdrop-blur-2xl overflow-hidden rounded-sm group
        ${style.bg} ${style.border} ${style.glow}
      `}
    >
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] opacity-20" />
      
      <div className="flex items-start gap-4 p-4 pr-10">
        <div className="mt-0.5 relative">
          <div className={`absolute inset-0 blur-md opacity-50 ${style.textColor.replace('text-', 'bg-')}`} />
          {style.icon}
        </div>
        
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] font-mono ${style.textColor}`}>
              {toast.title}
            </span>
            <div className={`w-1 h-1 rounded-full animate-pulse ${style.accent}`} />
          </div>
          
          {toast.message && (
            <div className="relative">
               <motion.span 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="text-sm text-white font-bold leading-tight break-words tracking-tight block"
               >
                {">"} {toast.message}
              </motion.span>
            </div>
          )}
        </div>

        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 p-1 rounded-sm text-slate-500 hover:text-white hover:bg-white/10 transition-all group-hover:rotate-90"
        >
          <X size={14} />
        </button>
      </div>

      {/* Technical Footer Detail */}
      <div className="h-4 bg-black/40 border-t border-white/5 px-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className={`w-3 h-[2px] ${style.accent} opacity-50`} />
          <div className="w-1.5 h-[2px] bg-white opacity-20" />
          <div className="w-1.5 h-[2px] bg-white opacity-20" />
        </div>
        <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
          <Terminal size={6} /> HUD_SYSTEM_LOG_v3.4
        </span>
      </div>

      {/* Progress Bar Wrapper */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/5">
        <motion.div 
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: (toast.duration || 5000) / 1000, ease: "linear" }}
          className={`h-full ${style.accent}`}
        />
      </div>

      {/* Corner Accents */}
      <div className={`absolute top-0 left-0 w-1.5 h-1.5 border-t border-l ${style.border.replace('/40', '').replace('/60', '')} opacity-60`} />
      <div className={`absolute top-0 right-0 w-1.5 h-1.5 border-t border-r ${style.border.replace('/40', '').replace('/60', '')} opacity-60`} />
    </motion.div>
  );
};

export const useToast = () => useContext(ToastContext);
