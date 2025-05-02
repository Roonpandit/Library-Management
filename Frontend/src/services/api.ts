import axios from "axios";

export const api = axios.create({
  baseURL: "https://library-management-1ixf.onrender.com/api",
});

if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      typeof window !== "undefined"
    ) {
      const hasToken = localStorage.getItem("token");
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];

      window.location.href = hasToken ? "/login" : "/";
    }
    return Promise.reject(error);
  }
);
