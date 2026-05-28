import Keycloak from "keycloak-js";

/** Docker (nginx :80): mesma origem + /realms. Dev direto: :8081. Dev Vite: defina VITE_KEYCLOAK_URL. */
function resolveKeycloakUrl(): string {
  const envUrl = import.meta.env.VITE_KEYCLOAK_URL as string | undefined;
  if (envUrl) return envUrl.replace(/\/$/, "");
  if (typeof window !== "undefined") {
    const port = window.location.port;
    if (port === "" || port === "80") {
      return window.location.origin;
    }
  }
  return "http://localhost:8081";
}

const keycloakConfig = {
  url: resolveKeycloakUrl(),
  realm: "Kizuna",
  clientId: "kizuna-app",
};

const keycloak = new Keycloak(keycloakConfig);

export let initError: any = null;

export const initKeycloak = (onAuthenticatedType: () => void) => {
  keycloak
    .init({
      onLoad: "login-required",
      checkLoginIframe: false,
      pkceMethod: "S256",
      enableLogging: true,
    })
    .then((authenticated) => {
      console.log("Keycloak initialized. Authenticated:", authenticated);
      if (authenticated) {
        console.log("Token Parsed:", keycloak.tokenParsed);
        console.log("User Preferred Username:", keycloak.tokenParsed?.preferred_username);
      } else {
        console.log("User is not authenticated");
      }
      onAuthenticatedType();
    })
    .catch((err) => {
      console.error("Keycloak initialization/exchange failed", err);
      initError = err || "Failed to initialize Keycloak. Check Console (F12) for CORS or Configuration errors.";
      onAuthenticatedType();
    });
};

export const doLogin = keycloak.login;
export const doLogout = () => {
  keycloak.logout({
    redirectUri: window.location.origin,
  });
};
export const getToken = () => keycloak.token;
export const isAuthenticated = () => keycloak.authenticated;
export const updateToken = (minValidity = 5) => keycloak.updateToken(minValidity);
export const getUsername = () => keycloak.tokenParsed?.preferred_username;
type TokenPayload = {
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
  roles?: string[];
};

function parseAccessTokenPayload(): TokenPayload | null {
  const token = keycloak.token;
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

/** Roles do access token enviado nas APIs (fonte confiável; evita cache do keycloak-js). */
export const getRolesFromAccessToken = (): string[] => {
  const payload = parseAccessTokenPayload();
  if (!payload) {
    return getRolesFromKeycloakState();
  }
  const realmRoles = payload.realm_access?.roles ?? [];
  const clientRoles = Object.values(payload.resource_access ?? {}).flatMap(
    (access) => access.roles ?? []
  );
  const topLevel = payload.roles ?? [];
  return [...new Set([...realmRoles, ...clientRoles, ...topLevel])];
};

function getRolesFromKeycloakState(): string[] {
  const realmRoles = keycloak.realmAccess?.roles || [];
  const clientRoles = Object.values(keycloak.resourceAccess || {}).flatMap(
    (access) => access.roles || []
  );
  return [...new Set([...realmRoles, ...clientRoles])];
}

export const getRoles = () => getRolesFromAccessToken();
export const getUserId = () => keycloak.subject;

export default keycloak;
