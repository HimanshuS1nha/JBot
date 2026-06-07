import { UserIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AxiosError } from "axios";

import Loading from "@/components/loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUser } from "@/hooks/use-user";
import { useAuthToken } from "@/hooks/use-auth-token";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { ROUTES } from "@/constants/routes";

const UserButton = () => {
  const { user, isPending, error } = useUser();

  const setAuthToken = useAuthToken((state) => state.setToken);

  const navigate = useNavigate();

  const { mutate: handleLogout, isPending: logoutPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await window.electron.deleteToken();
    },
    onSuccess: () => {
      setAuthToken(null);
      ToastHelper.successToast("Logged out successfully");
      navigate(ROUTES.auth.login, { replace: true });
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  useEffect(() => {
    if (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        navigate(ROUTES.auth.login, { replace: true });
      }

      ToastHelper.errorToast(parseErrorToString(error));
    }
  }, [error]);
  return (
    <>
      {isPending ? (
        <Loading />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <UserIcon className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex-1 flex flex-col items-start min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-sidebar-foreground/50 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleLogout()}
                disabled={logoutPending}
                className={"cursor-pointer"}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default UserButton;
