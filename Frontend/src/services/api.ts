import axios from "axios"

export const api = axios.create({
  baseURL: "https://library-management-1ixf.onrender.com/api",
})

// Add token to requests if we're in browser environment
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token")
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  }
}

// Interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && typeof window !== "undefined") {
      const hasToken = localStorage.getItem("token")
      // Clear auth data
      localStorage.removeItem("token")
      delete api.defaults.headers.common["Authorization"]
      
      // If there was a token (session expired), redirect to login
      // If no token (already logged out), redirect to landing page
      window.location.href = hasToken ? "/login" : "/"
    }
    return Promise.reject(error)
  },
)
