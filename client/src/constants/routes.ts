export const ROUTES = {
  home: "/home",
  auth: {
    login: "/login",
    register: "/register",
  },
  conversation: (id: string) => `/${id}`,
} as const;
