import { useCallback, useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { dataApi } from "@/lib/api";
import { ensureFreshAdminToken, MissingAdminRoleError } from "@/lib/adminApiSession";
import { getApiErrorMessage } from "@/lib/apiError";
import axios from "axios";
import { useToast } from "@/contexts/ToastContext";
import { showToast, TOAST } from "@/lib/toastMessages";
import {
  Copy,
  KeyRound,
  Loader2,
  Plus,
  ShieldAlert,
  Trash2,
  Terminal,
  Radio,
} from "lucide-react";

export interface IntegrationApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  active: boolean;
}

const API_KEYS_PATH = "/integration/admin/api-keys";
const AUTH_CHECK_PATH = "/integration/admin/api-keys/auth-check";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function isMaskedKey(key: string) {
  return key.includes("...");
}

function handleAdminApiError(
  err: unknown,
  toastError: (title: string, message?: string) => void,
  fallbackTitle: string,
  fallbackMessage: string
) {
  if (err instanceof MissingAdminRoleError) {
    toastError(
      "Sessão sem permissão ADMIN",
      "Faça logout, entre novamente com um usuário ADMIN e tente outra vez."
    );
    return;
  }
  if (axios.isAxiosError(err) && err.response?.status === 403) {
    toastError(
      "Acesso negado (403)",
      getApiErrorMessage(
        err,
        "Token desatualizado ou sem role ADMIN. Faça logout e login novamente."
      )
    );
    return;
  }
  toastError(fallbackTitle, getApiErrorMessage(err, fallbackMessage));
}

export default function IntegrationApiKeys() {
  const { success, error: toastError } = useToast();
  const [keys, setKeys] = useState<IntegrationApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [creating, setCreating] = useState(false);

  const [revealedKey, setRevealedKey] = useState<IntegrationApiKey | null>(null);
  const [revealOpen, setRevealOpen] = useState(false);

  const [revokeTarget, setRevokeTarget] = useState<IntegrationApiKey | null>(null);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      await ensureFreshAdminToken();
      const check = await dataApi.get<{ admin: boolean; roles: string[]; username: string }>(AUTH_CHECK_PATH);
      if (!check.data?.admin) {
        console.warn("[KIZUNA] auth-check:", check.data);
        throw new MissingAdminRoleError();
      }
      const res = await dataApi.get<IntegrationApiKey[]>(API_KEYS_PATH);
      setKeys(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch API keys", err);
      handleAdminApiError(
        err,
        toastError,
        TOAST.common.requestFailed.title,
        TOAST.common.requestFailed.message
      );
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreate = async () => {
    const name = createName.trim();
    if (!name) {
      showToast(toastError, TOAST.common.missingFields);
      return;
    }
    try {
      setCreating(true);
      await ensureFreshAdminToken();
      const res = await dataApi.post<IntegrationApiKey>(API_KEYS_PATH, { name });
      setCreateOpen(false);
      setCreateName("");
      await fetchKeys();
      setRevealedKey(res.data);
      setRevealOpen(true);
      showToast(success, TOAST.integration.created);
    } catch (err) {
      handleAdminApiError(
        err,
        toastError,
        TOAST.integration.createFailed.title,
        TOAST.common.requestFailed.message
      );
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    try {
      setRevoking(true);
      await ensureFreshAdminToken();
      await dataApi.patch(`${API_KEYS_PATH}/${revokeTarget.id}/disable`);
      setRevokeOpen(false);
      setRevokeTarget(null);
      await fetchKeys();
      showToast(success, TOAST.integration.revoked);
    } catch (err) {
      handleAdminApiError(
        err,
        toastError,
        TOAST.integration.revokeFailed.title,
        TOAST.common.requestFailed.message
      );
    } finally {
      setRevoking(false);
    }
  };

  const copyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      showToast(success, TOAST.integration.copied);
    } catch {
      showToast(toastError, TOAST.integration.copyFailed);
    }
  };

  return (
    <MainLayout>
      <div className="px-8 pb-8 space-y-6 mt-[-14px]">
        {/* HEADER KIZUNA */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-l-[6px] border-red-700 pl-5 py-4 bg-transparent/40 backdrop-blur-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1 flex items-center gap-2">
              <Radio size={12} className="animate-pulse shrink-0" />
              External Integration Relay
            </span>
            <div className="flex flex-wrap items-baseline gap-2">
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                Integration
              </h1>
              <span className="text-4xl font-black text-red-600 tracking-tighter uppercase leading-none">
                API Keys
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-xl">
              Chaves somente leitura · métricas e eventos via{" "}
              <code className="text-red-500/90">/data/integration/v1</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-4 py-2 border border-white/5 bg-white/[0.02] rounded flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Mode: Read-Only
              </span>
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white font-black rounded-md px-6 h-10 shadow-lg shadow-red-900/30 flex items-center gap-2 uppercase tracking-wider text-[11px]">
                  <Plus size={18} strokeWidth={3} /> Nova chave
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md border-t-4 border-red-600 bg-black/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black tracking-tighter uppercase italic text-white">
                    Criar chave de integração
                  </DialogTitle>
                  <DialogDescription className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Identifique o sistema parceiro (ERP, BI, etc.)
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase ml-1 tracking-wider">
                    Nome / identificador
                  </label>
                  <Input
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="Ex.: ERP Acme, Dashboard BI"
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-red-600"
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreate}
                    disabled={creating}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest"
                  >
                    {creating ? <Loader2 className="animate-spin" size={16} /> : "Gerar chave"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* CHAVES ATIVAS */}
        <Card className="p-5 max-w-xs flex flex-col items-center justify-center gap-4 group hover:border-white/20 transition-all border-white/5 bg-transparent/40 backdrop-blur-md">
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">
              Chaves ativas
            </p>
            <p className="text-3xl font-black text-white tracking-tighter italic">
              {loading ? "—" : keys.length.toString().padStart(2, "0")}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-950/30 border border-blue-900/50 shadow-[0_0_8px_rgba(59,130,246,0.2)] text-blue-500 flex items-center justify-center transition-transform group-hover:scale-110">
            <KeyRound size={22} />
          </div>
        </Card>

        {/* API USAGE */}
        <Card className="p-5 border-white/5 bg-transparent/40 backdrop-blur-md">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-950/30 border border-red-900/50 flex items-center justify-center text-red-500 shrink-0">
              <Terminal size={18} />
            </div>
            <div className="text-[11px] text-slate-300 space-y-2 min-w-0">
              <p className="font-black uppercase text-red-600 tracking-[0.2em] text-[10px]">
                Uso pela API externa
              </p>
              <p className="text-slate-400 leading-relaxed">
                Header{" "}
                <code className="text-white/90 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                  X-API-Key
                </code>{" "}
                ou{" "}
                <code className="text-white/90 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                  Authorization: Bearer &lt;chave&gt;
                </code>
              </p>
              <p className="font-mono text-[10px] text-slate-500 break-all">
                GET /api-data/integration/v1/metrics/summary?period=30d
              </p>
            </div>
          </div>
        </Card>

        {/* TABLE */}
        <Card className="p-0 border-white/5 bg-transparent/40 backdrop-blur-md overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-white/[0.02]">
            <ShieldAlert size={16} className="text-red-600" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              Somente administradores
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16 text-slate-400">
              <Loader2 className="animate-spin" size={28} />
            </div>
          ) : keys.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <KeyRound className="mx-auto mb-3 opacity-40" size={40} />
              <p className="text-sm font-bold uppercase tracking-wider">Nenhuma chave ativa</p>
              <p className="text-[11px] mt-1">Crie uma chave para permitir leitura por sistemas externos.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Chave (mascarada)</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold text-slate-300">{item.name}</TableCell>
                    <TableCell>
                      <code className="text-[11px] text-slate-400 bg-black/40 px-2 py-1 rounded border border-white/5">
                        {item.key}
                      </code>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={item.active ? "success" : "destructive"}
                        className="text-[9px] font-black uppercase px-3"
                      >
                        {item.active ? "Ativa" : "Revogada"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-500 hover:bg-white/10"
                        title="Revogar chave"
                        onClick={() => {
                          setRevokeTarget(item);
                          setRevokeOpen(true);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <Dialog open={revealOpen} onOpenChange={setRevealOpen}>
        <DialogContent className="max-w-lg border-t-4 border-red-600 bg-black/95 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase italic text-white">
              Guarde esta chave <span className="text-red-600">agora</span>
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-sm">
              A chave completa de <strong className="text-white">{revealedKey?.name}</strong> só
              aparece nesta tela. Depois, apenas o valor mascarado ficará visível na lista.
            </DialogDescription>
          </DialogHeader>
          {revealedKey && (
            <div className="space-y-3 py-2">
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={revealedKey.key}
                  className="font-mono text-xs bg-white/5 border-red-900/50 text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 border-red-900/50 text-red-500 hover:bg-red-950/30"
                  onClick={() => copyKey(revealedKey.key)}
                >
                  <Copy size={16} />
                </Button>
              </div>
              {!isMaskedKey(revealedKey.key) ? null : (
                <p className="text-[10px] text-red-500/80 uppercase font-bold tracking-wider">
                  Resposta já mascarada — gere uma nova chave se necessário.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              className="w-full bg-red-600 hover:bg-red-700 font-black uppercase tracking-widest"
              onClick={() => setRevealOpen(false)}
            >
              Entendi, já copiei
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={revokeOpen}
        onClose={() => setRevokeOpen(false)}
        title="Revogar chave de integração?"
        description={
          revokeTarget
            ? `Sistemas que usam a chave "${revokeTarget.name}" deixarão de acessar a API de leitura.`
            : ""
        }
        confirmLabel={revoking ? "Revogando..." : "Revogar"}
        onConfirm={handleRevoke}
        variant="danger"
        loading={revoking}
      />
    </MainLayout>
  );
}
