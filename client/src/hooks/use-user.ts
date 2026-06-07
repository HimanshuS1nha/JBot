import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";

import { API_ROUTES } from "@/constants/api-routes";
import { QUERY_KEYS } from "@/constants/query-keys";

import type { UserType } from "@/types";

export const useUser = () => {
  const { data, isPending, error } = useQuery({
    queryKey: QUERY_KEYS.getUser,
    queryFn: async () => {
      const { data } = await axios.get<UserType>(API_ROUTES.auth.me);

      return data;
    },
  });

  return { user: data, isPending, error };
};
