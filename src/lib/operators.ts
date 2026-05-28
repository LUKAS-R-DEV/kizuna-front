export interface OperatorUser {
  keycloakId: string;
  username: string;
  fullName: string;
  email?: string;
  roles?: string[];
}

const BLOCKED_ROLES = new Set(["offline_access", "uma_authorization"]);

function normalizeRole(role: string): string {
  const upper = role.toUpperCase();
  return upper.startsWith("ROLE_") ? upper.slice(5) : upper;
}

function isBusinessRole(role: string): boolean {
  if (role.startsWith("default-roles-")) return false;
  return !BLOCKED_ROLES.has(role);
}

export function isStrictOperator(user: OperatorUser): boolean {
  const businessRoles = (user.roles ?? [])
    .filter(isBusinessRole)
    .map(normalizeRole);

  return businessRoles.length === 1 && businessRoles[0] === "OPERATOR";
}

export function filterStrictOperators<T extends OperatorUser>(users: T[]): T[] {
  return users.filter(isStrictOperator);
}

export function getOperatorLabel(user: OperatorUser): string {
  const name = user.fullName?.trim() || user.username;
  return `${name} (@${user.username})`;
}
