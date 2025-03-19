import { createContext, useCallback, useContext, useState } from "react";

import { axios, axios2 } from "@/axios";

export interface TAuthContext {
  sourceToken: string | null;
  destinationToken: string | null;
  updateSourceToken: (nt: string | null) => void;
  updateDestinationToken: (nt: string | null) => void;
}

const AuthContext = createContext<TAuthContext | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [sourceToken, setSourceToken] = useState<string | null>(null);
  const [destinationToken, setDestinationToken] = useState<string | null>(null);

  const updateSourceToken = useCallback((newToken: string | null) => {
    if (newToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      setSourceToken(newToken);
    } else {
      delete axios.defaults.headers.common.Authorization;
      setSourceToken(null);
    }
  }, []);

  const updateDestinationToken = useCallback((newToken: string | null) => {
    if (newToken) {
      axios2.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      setDestinationToken(newToken);
    } else {
      delete axios2.defaults.headers.common.Authorization;
      setDestinationToken(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        sourceToken,
        destinationToken,
        updateSourceToken,
        updateDestinationToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used with a AuthProvider");
  }

  return ctx;
};
