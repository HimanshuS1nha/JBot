import { create } from "zustand";

type UseSelectedConversationType = {
  selectedId: string | null;
  setSelectedId: (selectedId: string | null) => void;
};

export const useSelectedConversation = create<UseSelectedConversationType>(
  (set) => {
    return {
      selectedId: null,
      setSelectedId: (selectedId) => set({ selectedId }),
    };
  },
);
