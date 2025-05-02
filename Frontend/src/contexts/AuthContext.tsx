import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";
import type { User, AuthResponse, ApiError } from "../types";
import { api } from "../services/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  registrationSuccess: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  clearRegistrationSuccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const { data } = await api.get<User>("/auth/profile");
          setUser(data);
        } catch (error) {
          localStorage.removeItem("token");
          delete api.defaults.headers.common["Authorization"];
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      const { token, ...userData } = data;
      setUser(userData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiError;
        setError(apiError.message || "Failed to login");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await api.post("/auth/register", { name, email, password });
      setRegistrationSuccess(true);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiError = error.response.data as ApiError;
        if (apiError.errors && apiError.errors.length > 0) {
          setError(apiError.errors.map((e) => e.message).join(", "));
        } else {
          setError(apiError.message || "Failed to register");
        }
      } else {
        setError("An unexpected error occurred");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  const clearRegistrationSuccess = () => {
    setRegistrationSuccess(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        registrationSuccess,
        login,
        register,
        logout,
        clearError,
        clearRegistrationSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
