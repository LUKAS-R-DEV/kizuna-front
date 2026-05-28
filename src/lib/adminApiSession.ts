import keycloak, { getRolesFromAccessToken, updateToken } from "@/lib/auth";
import { isAdmin } from "@/lib/roles";

export class MissingAdminRoleError extends Error {
  constructor() {
    super("ADMIN role is required for this action.");
    this.name = "MissingAdminRoleError";
  }
}

/** Renova o access token e garante role ADMIN no token que será enviado à API. */
export async function ensureFreshAdminToken(): Promise<void> {
  if (!keycloak.authenticated) {
    await keycloak.login();
    return;
  }

  await updateToken(-1);

  const roles = getRolesFromAccessToken();
  if (!isAdmin(roles)) {
    console.warn("[KIZUNA] Access token sem role ADMIN:", roles);
    await keycloak.login({ prompt: "login" });
    throw new MissingAdminRoleError();
  }
}
