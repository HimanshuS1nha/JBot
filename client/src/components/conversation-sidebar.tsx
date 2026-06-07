import { useEffect, useState } from "react";
import { BotIcon, PlusIcon, SearchIcon } from "lucide-react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import Loading from "@/components/loading";
import ConversationCard from "@/components/conversation-card";
import UserButton from "@/components/user-button";

import { axios } from "@/lib/axios";

import { useCreateConversation } from "@/hooks/use-create-conversation";

import { API_ROUTES } from "@/constants/api-routes";
import { QUERY_KEYS } from "@/constants/query-keys";

import type { ConversationType } from "@/types";

function groupConversations(convs: ConversationType[]) {
  const now = new Date(2026, 4, 25); // May 25, 2026
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);
  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - 7);

  const today: ConversationType[] = [];
  const yesterday: ConversationType[] = [];
  const lastWeek: ConversationType[] = [];
  const older: ConversationType[] = [];

  for (const c of convs) {
    if (new Date(c.createdAt) >= todayStart) today.push(c);
    else if (new Date(c.createdAt) >= yesterdayStart) yesterday.push(c);
    else if (new Date(c.createdAt) >= weekStart) lastWeek.push(c);
    else older.push(c);
  }

  return [
    { label: "Today", items: today },
    { label: "Yesterday", items: yesterday },
    { label: "Previous 7 Days", items: lastWeek },
    { label: "Older", items: older },
  ];
}

const ConversationSidebar = () => {
  const { inView, ref } = useInView();

  const { createConversation, isPending: createConversationPending } =
    useCreateConversation();

  const [search, setSearch] = useState("");

  const {
    data,
    isPending: conversationsPending,
    isFetching,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    getNextPageParam: (prevData, _, lastPageParam) =>
      prevData ? lastPageParam + 1 : undefined,
    initialPageParam: 0,
    placeholderData: keepPreviousData,
    queryKey: QUERY_KEYS.getConversations,
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get<ConversationType[]>(
        API_ROUTES.conversation.getAll(pageParam, search),
      );

      return data;
    },
  });

  const conversations = (data?.pages.flat() ?? []) as ConversationType[];

  const groups = groupConversations(conversations);
  const hasResults = groups.some((g) => g.items.length > 0);

  useEffect(() => {
    if (inView && !isFetching) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      refetch();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);
  return (
    <Sidebar>
      <SidebarHeader className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <BotIcon className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-sidebar-foreground">
            JBot
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-auto text-sidebar-foreground/60 hover:text-sidebar-foreground"
            onClick={() => createConversation()}
            disabled={createConversationPending}
            title="New chat"
          >
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative mt-1">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sidebar-foreground/40 pointer-events-none" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs shadow-none focus-visible:ring-1 focus-visible:ring-sidebar-ring"
          />
        </div>
      </SidebarHeader>

      {/* Conversation list */}
      {conversationsPending ? (
        <Loading />
      ) : (
        <SidebarContent className="px-1 py-1 border-t">
          {!hasResults && (
            <div className="py-10 text-center text-xs text-sidebar-foreground/50 px-4">
              {search
                ? "No conversations match your search."
                : "No conversations yet."}
            </div>
          )}

          {groups.map(
            ({ label, items }) =>
              items.length > 0 && (
                <SidebarGroup key={label} className="py-1 px-1">
                  <SidebarGroupLabel className="text-[11px] font-medium text-sidebar-foreground/50 px-2 mb-0.5">
                    {label}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {items.map((conv) => (
                        <ConversationCard
                          key={conv.id}
                          conv={conv}
                          label={label}
                        />
                      ))}

                      <div ref={ref}>{isFetching && <Loading size={14} />}</div>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ),
          )}
        </SidebarContent>
      )}

      {/* Footer */}
      <SidebarFooter className="px-3 py-2 border-t">
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
};

export default ConversationSidebar;
