import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import Loading from "@/components/loading";

import { useAuthToken } from "@/hooks/use-auth-token";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { ROUTES } from "@/constants/routes";

const LoadingPage = () => {
  const setToken = useAuthToken((state) => state.setToken);

  const navigate = useNavigate();

  const { data, error, isPending } = useQuery({
    queryKey: ["get-token"],
    queryFn: async () => {
      const token = await window.electron.getToken();

      return token;
    },
  });

  useEffect(() => {
    if (!isPending) {
      if (data) {
        setToken(data);
        navigate(ROUTES.home);
      } else {
        navigate(ROUTES.auth.login);
      }
    }
  }, [data, isPending, setToken]);

  useEffect(() => {
    if (error) {
      ToastHelper.errorToast(parseErrorToString(error));
    }
  }, [error]);
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Loading />
    </div>
  );
};

export default LoadingPage;
