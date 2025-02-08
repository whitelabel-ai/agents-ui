import { createContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string) => void;
  removeToken?: () => void;
};

const initialValue: AuthContextType = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  setToken: () => {}
};

const AuthContext = createContext<AuthContextType>(initialValue);

export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setToken = (token: string) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, setToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;