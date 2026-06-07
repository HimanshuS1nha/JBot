import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import { axios } from "@/lib/axios";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { API_ROUTES } from "@/constants/api-routes";
import { QUERY_KEYS } from "@/constants/query-keys";
import { ROUTES } from "@/constants/routes";

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-conversation"],
    mutationFn: async () => {
      const { data } = await axios.post<{ message: string }>(
        API_ROUTES.conversation.create,
      );

      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getConversations,
      });
      ToastHelper.successToast(data.message);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        navigate(ROUTES.auth.login, { replace: true });
      }

      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  return { createConversation: mutate, isPending };
};
