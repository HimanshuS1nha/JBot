export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },
  conversation: {
    getAll: (page: number, search: string) =>
      `/conversations?page=${page}&size=15&searchQuery=${search}`,
    getMessagesById: (id: string, page: number) =>
      `/conversation/${id}/messages?page=${page}&size=15`,
    deleteById: (id: string) => `/conversation/${id}`,
    deleteAll: "/conversations",
    create: "/conversation",
    editTitle: (id: string) => `/conversation/${id}`,
  },
  ai: {
    chat: (conversationId: string) => `/ai/${conversationId}/chat`,
    generateTitle: "/ai/title",
  },
} as const;
