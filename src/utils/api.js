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
    const status = error.response && error.response.status;

    if (!error.response) {
      return Promise.reject(new ApiError("Network error", "NETWORK_ERROR"));
    }

    if (status === 401) {
      if (onAuthFailure) {
        onAuthFailure("unauthorized");
      }

      return Promise.reject(
        new ApiError(
          extractErrorMessage(error.response),
          "UNAUTHORIZED",
          401,
          error.response && error.response.data,
        ),
      );
    }

    if (status === 403) {
      return Promise.reject(
        new ApiError(
          extractErrorMessage(error.response),
          "FORBIDDEN",
          403,
          error.response && error.response.data,
        ),
      );
    }

    if (status === 400) {
      return Promise.reject(
        new ApiError(
          extractErrorMessage(error.response),
          "BAD_REQUEST",
          400,
          error.response && error.response.data,
        ),
      );
    }

    return Promise.reject(
      new ApiError(
        extractErrorMessage(error.response),
        status && status >= 500 ? "SERVER_ERROR" : "UNKNOWN_ERROR",
        status,
        error.response && error.response.data,
      ),
    );
  },
);

function extractErrorMessage(response) {
  const data = response && response.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    if (typeof data.detail === "string") return data.detail;
    if (typeof data.message === "string") return data.message;
  }

  if (response && response.status === 401) return "Unauthorized.";
  if (response && response.status === 403) return "Forbidden.";
  if (response && response.status === 400) return "Bad Request.";
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
