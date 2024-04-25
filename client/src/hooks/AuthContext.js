import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {},
  signup: () => {},
  token: null,
  setToken: () => {},
  months: null,
  days: null
})