/**
 * Normalizes API / notification text to English for toasts.
 * Backend messages are mostly English; Portuguese fallbacks are mapped when detected.
 */

const EXACT_MAP: Record<string, string> = {
  "User authenticated successfully": "Signed in successfully.",
  "Invalid username or password": "Invalid username or password.",
  "Strategic data input rejected by core.": "The server rejected this request. Check the data and try again.",
  "Action blocked by security protocols.": "This action is not allowed.",
  "Node reconnection failed.": "Could not reactivate this item.",
  "Mainframe rejected the transaction signal.": "The server rejected this request. Try again.",
  "Network interference detected.": "Network error. Check your connection and try again.",
  "Action blocked by core.": "The server blocked this action.",
  "Invalid parameters or user exists.": "Invalid data or user already exists.",
  "Quantity must be greater than 0": "Quantity must be greater than zero.",
  "Quantity must be greater than zero": "Quantity must be greater than zero.",
  "Not enough inventory": "Insufficient stock for this operation.",
  "Not enough quantity": "Insufficient quantity available.",
  "Not enough stock for item": "Insufficient stock for one or more materials.",
  "Inventory not found": "Inventory item not found.",
  "InventoryMovement not found": "Stock movement not found.",
  "Production order is not planned or paused": "Order must be planned or paused to start.",
  "Production order must be IN_PROGRESS to pause": "Only in-progress orders can be paused.",
  "Production order must be PAUSED to resume": "Only paused orders can be resumed.",
  "You are not the operator of this production order": "You are not assigned as operator for this order.",
  "Production order is not in progress": "Order is not in progress.",
  "Production order is already completed": "This order is already completed.",
  "Production order is not planned": "Order is not in planned status.",
  "Production order must be REWORK to rework": "Only rework orders can be sent back to production.",
  "Production order already reworked": "This order has already been reworked.",
  "Production order is not in waiting inspection status": "Order is not waiting for quality inspection.",
  "The production order has already undergone rework; accept or reject it.":
    "This order was already reworked. Approve or reject the inspection.",
  "Recipe has no items": "Recipe has no materials defined.",
  "Deadline must be after current date": "Deadline must be in the future.",
  "Inventory type must be RAW": "Only raw materials can be used here.",
  "Inventory type must be FINISHED": "Only finished products can be used here.",
  "Product must be finished": "Product must be a finished good.",
  "Recipe already exists": "A recipe already exists for this product.",
  "Recipe must have at least one ingredient": "Add at least one material to the recipe.",
  "Inventory must be raw": "Only raw materials can be added to recipes.",
  "User not found": "User not found.",
  "User is not an operator": "Selected user is not an operator.",
  "Sem permissão para emitir esta ordem ou operador inválido.":
    "You do not have permission to create this order, or the operator is invalid.",
  "Logistics grid rejected the request.": "The server rejected this request.",
};

const PREFIX_MAP: [string, string][] = [
  ["Not enough stock for item ", "Insufficient stock for material: "],
];

const PT_MAP: Record<string, string> = {
  "Usuário autenticado com sucesso": "Signed in successfully.",
  "Usuário ou senha inválidos": "Invalid username or password.",
  "Senha inválida": "Invalid password.",
  "Sessão expirada": "Session expired. Sign in again.",
  "Acesso negado": "Access denied.",
  "Erro ao processar solicitação": "Could not complete the request. Try again.",
  "Dados inválidos": "Invalid data. Check the fields and try again.",
  "Recurso não encontrado": "Resource not found.",
};

function looksPortuguese(text: string): boolean {
  return /[ãõáéíóúâêôç]|(\bnão\b)|(\binválid)|(\berro\b)|(\bfalha\b)/i.test(text);
}

export function translateMessage(message: string | undefined | null): string | undefined {
  if (!message) return undefined;
  const trimmed = message.trim();
  if (!trimmed) return undefined;

  if (EXACT_MAP[trimmed]) return EXACT_MAP[trimmed];
  if (PT_MAP[trimmed]) return PT_MAP[trimmed];

  for (const [prefix, replacement] of PREFIX_MAP) {
    if (trimmed.startsWith(prefix)) {
      return replacement + trimmed.slice(prefix.length);
    }
  }

  if (looksPortuguese(trimmed)) {
    return trimmed;
  }

  return trimmed;
}
