import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CheckIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { axios } from "@/lib/axios";

import { useSelectedConversation } from "@/hooks/use-selected-conversation";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { ROUTES } from "@/constants/routes";
import { API_ROUTES } from "@/constants/api-routes";
import { QUERY_KEYS } from "@/constants/query-keys";

import type { ConversationType } from "@/types";

type Props = {
  conv: ConversationType;
  label: string;
};

function formatGroupDate(date: Date) {
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`;
}

function getTimestamp(conv: ConversationType, label: string): string {
  if (label === "Today") {
    return formatGroupDate(new Date(conv.createdAt));
  } else if (label === "Yesterday") {
    return formatGroupDate(new Date(conv.createdAt));
  }

  return new Date(conv.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const ConversationCard = ({ conv, label }: Props) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const selectedId = useSelectedConversation((state) => state.selectedId);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(conv.title);

  const {
    mutate: handleDeleteConversation,
    isPending: deleteConversationPending,
  } = useMutation({
    mutationKey: ["delete-conversation"],
    mutationFn: async () => {
      const { data } = await axios.delete<{ message: string }>(
        API_ROUTES.conversation.deleteById(conv.id),
      );

      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getConversations,
      });

      if (selectedId === conv.id) {
        navigate(ROUTES.home, { replace: true });
      }

      ToastHelper.successToast(data.message);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        navigate(ROUTES.auth.login, { replace: true });
      }

      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  const { mutate: handleEditTitle, isPending: editTitlePending } = useMutation({
    mutationKey: ["edit-title"],
    mutationFn: async () => {
      const { data } = await axios.patch<{ message: string }>(
        API_ROUTES.conversation.editTitle(conv.id),
        { title: newTitle },
      );

      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getConversations,
      });

      ToastHelper.successToast(data.message);
      setIsEditing(false);
      navigate(ROUTES.conversation(conv.id), {
        replace: true,
        state: { title: newTitle },
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        navigate(ROUTES.auth.login, { replace: true });
      }

      ToastHelper.errorToast(parseErrorToString(error));
    },
  });
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={conv.id === selectedId}
        onClick={() => {
          navigate(ROUTES.conversation(conv.id), {
            state: { title: conv.title },
          });
        }}
        className="flex-col items-start h-auto py-2 gap-0.5 rounded-lg"
        size="default"
      >
        <div className="flex w-full items-center justify-between gap-2">
          {isEditing ? (
            <input
              value={newTitle}
              placeholder="Enter new title"
              className="w-36"
              autoFocus
              onChange={(e) => setNewTitle(e.target.value)}
            />
          ) : (
            <div className="flex flex-col gap-y-1.5">
              <span className="truncate text-xs font-medium leading-snug w-32">
                {conv.title}
              </span>
              <span className="text-[10px] text-sidebar-foreground/40 shrink-0 font-normal">
                {getTimestamp(conv, label)}
              </span>
            </div>
          )}

          {isEditing ? (
            <div className="flex gap-x-3">
              <Button
                size={"icon-sm"}
                variant={"ghost"}
                className={"dark:hover:bg-rose-600 hover:text-white"}
                onClick={(e) => {
                  e.stopPropagation();
                  setNewTitle(conv.title);
                  setIsEditing(false);
                }}
                disabled={editTitlePending}
              >
                <XIcon size={15} />
              </Button>
              <Button
                size={"icon-sm"}
                variant={"ghost"}
                className={"dark:hover:bg-emerald-600 hover:text-white"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditTitle();
                }}
                disabled={editTitlePending}
              >
                <CheckIcon size={15} />
              </Button>
            </div>
          ) : (
            <div className="flex gap-x-3">
              <Button
                size={"icon-sm"}
                variant={"ghost"}
                className={"dark:hover:bg-primary hover:text-white"}
                disabled={deleteConversationPending}
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon size={15} />
              </Button>
              <Button
                size={"icon-sm"}
                variant={"ghost"}
                className={"dark:hover:bg-primary hover:text-white"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConversation();
                }}
                disabled={deleteConversationPending}
              >
                <Trash2Icon size={15} />
              </Button>
            </div>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default ConversationCard;
