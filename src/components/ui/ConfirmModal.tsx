import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, ShieldCheck, Loader2, Lock, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { iamApi } from "@/lib/api";
import { getUsername } from "@/lib/auth";
import { useToast } from "@/contexts/ToastContext";
import { getApiErrorMessage } from "@/lib/apiError";
import { showToast, TOAST } from "@/lib/toastMessages";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info" | "success";
  requirePassword?: boolean;
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm Action",
  cancelLabel = "Cancel",
  variant = "info",
  requirePassword = false,
  loading = false,
}: ConfirmModalProps) {
  const [password, setPassword] = React.useState("");
  const [verifying, setVerifying] = React.useState(false);
  const { error: toastError, warning: toastWarning } = useToast();

  React.useEffect(() => {
    if (isOpen) {
      setPassword("");
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (requirePassword) {
      if (!password) {
        showToast(toastWarning, TOAST.common.passwordRequired);
        return;
      }

      setVerifying(true);
      try {
        const username = getUsername();
        if (!username) throw new Error("User session not found");

        await iamApi.authenticate(username, password);
        onConfirm();
        setPassword("");
      } catch (err: any) {
        console.error("Password verification failed", err);
        const status = err.response?.status;
        if (status === 401) {
          showToast(toastError, TOAST.common.sessionExpired);
        } else {
          toastError(
            TOAST.common.accessDenied.title,
            getApiErrorMessage(err, TOAST.common.invalidPassword.message)
          );
        }
      } finally {
        setVerifying(false);
      }
    } else {
      onConfirm();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          border: "border-red-600/50",
          shadow: "shadow-[0_0_50px_rgba(220,38,38,0.2)]",
          icon: <ShieldAlert className="text-red-500" size={24} />,
          button: "bg-red-600 hover:bg-red-700 active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.3)]",
          accent: "text-red-500",
          bg: "bg-red-950/20"
        };
      case "warning":
        return {
          border: "border-amber-500/50",
          shadow: "shadow-[0_0_50px_rgba(245,158,11,0.2)]",
          icon: <ShieldAlert className="text-amber-500" size={24} />,
          button: "bg-amber-600 hover:bg-amber-700 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
          accent: "text-amber-500",
          bg: "bg-amber-950/20"
        };
      case "success":
        return {
          border: "border-emerald-500/50",
          shadow: "shadow-[0_0_50px_rgba(16,185,129,0.2)]",
          icon: <ShieldCheck className="text-emerald-500" size={24} />,
          button: "bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
          accent: "text-emerald-500",
          bg: "bg-emerald-950/20"
        };
      default:
        return {
          border: "border-blue-500/50",
          shadow: "shadow-[0_0_50px_rgba(59,130,246,0.2)]",
          icon: <ShieldCheck className="text-blue-500" size={24} />,
          button: "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
          accent: "text-blue-500",
          bg: "bg-blue-950/20"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={`max-w-md border-t-4 ${styles.border} bg-black/95 backdrop-blur-xl border-white/10 ${styles.shadow}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
            {styles.icon} {title}
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <span className={styles.accent}>{">"}</span> Operational Protocol Requirement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className={`p-4 ${styles.bg} border ${styles.border.replace('/50', '/30')} rounded-lg`}>
            <p className="text-sm font-bold text-slate-300 leading-relaxed italic">
              {description}
            </p>
          </div>

          <AnimatePresence>
            {requirePassword && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Lock size={10} className={styles.accent} /> User Credentials / Password
                  </label>
                  <span className="text-[8px] font-bold text-slate-700 uppercase italic">Encrypted Connection</span>
                </div>
                <div className="relative">
                    <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ENTER PASSWORD TO AUTHORIZE..."
                    className="font-mono text-xs tracking-widest bg-black/60 border-white/5"
                    autoComplete="new-password"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleConfirm();
                    }}
                  />
                  <div className={`absolute top-0 right-0 h-full w-1 ${styles.accent.replace('text-', 'bg-')} opacity-40 animate-pulse`} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 text-[10px] font-black uppercase text-slate-400 border-white/5 hover:bg-white/5 h-12"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={verifying || loading}
              className={`flex-1 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-white h-12 ${styles.button}`}
            >
              {(verifying || loading) ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>EXECUTE PROTOCOL</>
              )}
            </Button>
          </div>
        </DialogFooter>

        {/* HUD Detail Footer */}
        <div className="mt-2 border-t border-white/5 pt-2 flex justify-between items-center">
            <div className="flex gap-1">
                 <div className={`w-4 h-0.5 ${styles.accent.replace('text-', 'bg-')} opacity-50`} />
                 <div className="w-1.5 h-0.5 bg-white/20" />
                 <div className="w-1.5 h-0.5 bg-white/20" />
            </div>
            <span className="text-[7px] font-black text-slate-600 uppercase flex items-center gap-1 tracking-widest">
                <Terminal size={6} /> SECURITY_ENFORCEMENT_v2.0
            </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
