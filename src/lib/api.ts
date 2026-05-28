import axios from "axios";
import keycloak, { getRolesFromAccessToken } from "./auth";
import { isAdmin } from "./roles";

const API_BASE_URLS = {
  CORE: "/api-core",
  IAM: "/api-iam",
  DATA: "/api-data",
  AUDIT: "/api-audit",
  NOTIFICATION: "/api-notification",
  AI: "/api-ai",
};

const api = axios.create({
  timeout: 120000,
});

api.interceptors.request.use(
  async (config) => {
    const url = config.url ?? "";
    if (url.includes("/users/authenticate")) {
      return config;
    }
    if (keycloak.authenticated) {
      try {
        const needsFreshAdminToken = url.includes("/integration/admin");
        await keycloak.updateToken(needsFreshAdminToken ? -1 : 5);
        const token = keycloak.token;
        if (needsFreshAdminToken && token && !isAdmin(getRolesFromAccessToken())) {
          console.warn("[KIZUNA] Token sem ADMIN antes da chamada admin:", getRolesFromAccessToken());
          await keycloak.login({ prompt: "login" });
          return Promise.reject(new Error("Access token missing ADMIN role"));
        }
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.Accept = "application/json";
      } catch (error) {
        console.error("Failed to refresh token", error);
        keycloak.login();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      const requestUrl = error.config?.url ?? "";
      const method = (error.config?.method ?? "get").toLowerCase();
      const isCoreSecurityReport = requestUrl.includes("/security/access-denied");
      const isHealthProbe =
        requestUrl.includes("/actuator/health") ||
        requestUrl.includes("/server-time");
      const isUsersMe = requestUrl.includes("/users/me");
      const isOperatorsList = requestUrl.includes("/users/allOperators");
      const isPasswordConfirm = requestUrl.includes("/users/authenticate");
      const skipRedirect =
        isCoreSecurityReport ||
        isHealthProbe ||
        isUsersMe ||
        isOperatorsList ||
        isPasswordConfirm ||
        method === "post";

      if (!isCoreSecurityReport && !isHealthProbe) {
        api
          .post(
            `${API_BASE_URLS.CORE}/security/access-denied`,
            {
              path: requestUrl,
              method: (error.config?.method ?? "unknown").toUpperCase(),
              service: error.config?.baseURL ?? "unknown",
              reason: error.response?.data?.message ?? "FORBIDDEN",
            },
            { headers: { "X-Skip-403-Redirect": "1" } }
          )
          .catch(() => {});
      }

      if (!skipRedirect) {
        window.location.href = "/access-denied";
      }
    }
    return Promise.reject(error);
  }
);

export const coreApi = {
  get: <T = any>(url: string, config = {}) => api.get<T>(`${API_BASE_URLS.CORE}${url}`, config),
  post: <T = any>(url: string, data = {}, config = {}) => api.post<T>(`${API_BASE_URLS.CORE}${url}`, data, config),
  put: <T = any>(url: string, data = {}, config = {}) => api.put<T>(`${API_BASE_URLS.CORE}${url}`, data, config),
  patch: <T = any>(url: string, data = {}, config = {}) => api.patch<T>(`${API_BASE_URLS.CORE}${url}`, data, config),
  delete: <T = any>(url: string, config = {}) => api.delete<T>(`${API_BASE_URLS.CORE}${url}`, config),
};

export const notificationApi = {
  get: <T = any>(url: string, config = {}) => {
    const target = url.startsWith("/actuator") ? url : `/notification${url}`;
    return api.get<T>(`${API_BASE_URLS.NOTIFICATION}${target}`, config);
  },
  post: <T = any>(url: string, data = {}, config = {}) => {
    const target = url.startsWith("/actuator") ? url : `/notification${url}`;
    return api.post<T>(`${API_BASE_URLS.NOTIFICATION}${target}`, data, config);
  },
  patch: <T = any>(url: string, data = {}, config = {}) => {
    const target = url.startsWith("/actuator") ? url : `/notification${url}`;
    return api.patch<T>(`${API_BASE_URLS.NOTIFICATION}${target}`, data, config);
  },
  delete: <T = any>(url: string, config = {}) => {
    const target = url.startsWith("/actuator") ? url : `/notification${url}`;
    return api.delete<T>(`${API_BASE_URLS.NOTIFICATION}${target}`, config);
  },
};

export const auditApi = {
  get: <T = any>(url: string, config = {}) => api.get<T>(`${API_BASE_URLS.AUDIT}${url}`, config),
  post: <T = any>(url: string, data = {}, config = {}) => api.post<T>(`${API_BASE_URLS.AUDIT}${url}`, data, config),
};

export const dataApi = {
  get: <T = any>(url: string, config = {}) => api.get<T>(`${API_BASE_URLS.DATA}${url}`, config),
  post: <T = any>(url: string, data = {}, config = {}) => api.post<T>(`${API_BASE_URLS.DATA}${url}`, data, config),
  patch: <T = any>(url: string, data = {}, config = {}) => api.patch<T>(`${API_BASE_URLS.DATA}${url}`, data, config),
};

export const iamApi = {
  get: <T = any>(url: string, config = {}) => api.get<T>(`${API_BASE_URLS.IAM}${url}`, config),
  post: <T = any>(url: string, data = {}, config = {}) => api.post<T>(`${API_BASE_URLS.IAM}${url}`, data, config),
  put: <T = any>(url: string, data = {}, config = {}) => api.put<T>(`${API_BASE_URLS.IAM}${url}`, data, config),
  delete: <T = unknown>(url: string, config = {}) => api.delete<T>(`${API_BASE_URLS.IAM}${url}`, config),
  authenticate: (userName: string, password: string) =>
    api.post(
      `${API_BASE_URLS.IAM}/users/authenticate`,
      { userName, password },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    ),
};

export const aiApi = {
  get: <T = unknown>(url: string, config = {}) => api.get<T>(`${API_BASE_URLS.AI}${url}`, config),
  post: <T = unknown>(url: string, data = {}, config = {}) => api.post<T>(`${API_BASE_URLS.AI}${url}`, data, config),
};

export default api;
