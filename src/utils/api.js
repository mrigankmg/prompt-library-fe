import axios from "axios";

export class ApiError extends Error {
  constructor(message, code, status, data) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

const api = axios.create({
  withCredentials: true,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

let onAuthFailure = null;

export function registerAuthFailureHandler(handler) {
  onAuthFailure = handler;
}

api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    config.headers.Accept = "application/json";

    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new ApiError("Network error", "NETWORK_ERROR"));
    }

    const { status, data } = error.response;
    const { code, reason } = parseDetail(data);

    if (status === 401 && onAuthFailure) {
      onAuthFailure("unauthorized");
    }

    return Promise.reject(
      new ApiError(
        reason ?? fallbackMessage(status),
        code ?? fallbackCode(status),
        status,
        data,
      ),
    );
  },
);

function parseDetail(data) {
  const detail = data?.detail;
  if (detail && typeof detail === "object") {
    return { code: detail.code ?? null, reason: detail.reason ?? null };
  }
  return { code: null, reason: null };
}

function fallbackCode(status) {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 400) return "BAD_REQUEST";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN_ERROR";
}

function fallbackMessage(status) {
  if (status === 401) return "Unauthorized.";
  if (status === 403) return "Forbidden.";
  if (status === 400) return "Bad request.";
  if (status >= 500) return "Server error.";
  return "Unexpected error.";
}

export const apiClient = {
  get: (url, config) => api.request({ ...(config || {}), method: "GET", url }),

  post: (url, data, config) =>
    api.request({ ...(config || {}), method: "POST", url, data }),

  put: (url, data, config) =>
    api.request({ ...(config || {}), method: "PUT", url, data }),

  patch: (url, data, config) =>
    api.request({ ...(config || {}), method: "PATCH", url, data }),

  delete: (url, config) =>
    api.request({ ...(config || {}), method: "DELETE", url }),
};

export default api;
