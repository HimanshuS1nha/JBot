import { create } from "zustand";

type UseAuthTokenType = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const useAuthToken = create<UseAuthTokenType>((set) => {
  return {
    token: null,
    setToken: (token) => set({ token }),
  };
});
