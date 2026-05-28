/** Roles do realm Keycloak (case-insensitive). ADMIN tem acesso global no frontend. */
export function normalizeRole(role: string): string {
  return role.trim().toUpperCase();
}

export function getNormalizedRoles(roles: string[]): string[] {
  return [...new Set(roles.map(normalizeRole))];
}

export function isAdmin(roles: string[]): boolean {
  return getNormalizedRoles(roles).includes("ADMIN");
}

export function hasAnyRole(userRoles: string[], required: string[]): boolean {
  const normalized = getNormalizedRoles(userRoles);
  if (normalized.includes("ADMIN")) return true;
  const requiredNorm = required.map(normalizeRole);
  return requiredNorm.some((r) => normalized.includes(r));
}

const ROLE_DISPLAY_PRIORITY = [
  "ADMIN",
  "EXECUTIVE",
  "MANAGER",
  "PLANNER",
  "INSPECTOR",
  "OPERATOR",
] as const;

/** Primary business role for UI badges (ignores Keycloak system roles). */
export function pickPrimaryRole(roles: string[] | undefined | null): string | null {
  if (!roles?.length) return null;
  const normalized = getNormalizedRoles(roles);
  for (const role of ROLE_DISPLAY_PRIORITY) {
    if (normalized.includes(role)) return role;
  }
  return normalized[0] ?? null;
}
