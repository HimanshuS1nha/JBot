import { useState, useRef, useEffect } from "react";
import { BotIcon, SendIcon, SparklesIcon } from "lucide-react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams, useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Loading from "@/components/loading";
import Message from "@/components/message";

import { axios } from "@/lib/axios";

import { useSelectedConversation } from "@/hooks/use-selected-conversation";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { API_ROUTES } from "@/constants/api-routes";
import { SUGGESTIONS } from "@/constants/suggestions";
import { QUERY_KEYS } from "@/constants/query-keys";

import type { MessageType } from "@/types";

const ConversationPage = () => {
  const { state } = useLocation();

  const { conversationId } = useParams() as { conversationId: string };

  const { ref, inView } = useInView();

  const queryClient = useQueryClient();

  const setSelectedId = useSelectedConversation((state) => state.setSelectedId);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data, isPending, isFetching, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: QUERY_KEYS.getMessages,
      queryFn: async ({ pageParam }) => {
        const { data } = await axios.get<MessageType[]>(
          API_ROUTES.conversation.getMessagesById(conversationId, pageParam),
        );

        return data;
      },
      initialPageParam: 0,
      getNextPageParam: (prevData, _, prevPage) =>
        prevData ? prevPage + 1 : undefined,
    });

  const { mutate: handleChat } = useMutation({
    mutationKey: ["chat"],
    mutationFn: async () => {
      const { data } = await axios.post<{ message: string }>(
        API_ROUTES.ai.chat(conversationId),
        messages,
      );

      return data;
    },
    onSuccess: async (data) => {
      const botMsg = {
        id: `msg-${Date.now()}-bot`,
        role: "Assistant" as const,
        content: data.message,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.getConversations,
      });
    },
    onSettled: () => {
      setIsThinking(false);
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (data && !isThinking) {
      const messages = data.pages.flat();
      messages.reverse();
      setMessages(messages ?? []);
    }
  }, [data]);

  useEffect(() => {
    if (inView && !isFetching) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  useEffect(() => {
    setSelectedId(conversationId);
    refetch();
  }, [conversationId]);

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMsg = {
      id: `msg-${Date.now()}-user`,
      role: "User" as const,
      content: trimmed,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    resetTextareaHeight();
    setIsThinking(true);
    handleChat();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-background">
      <header className="flex items-center gap-2 h-12 px-3 border-b shrink-0 bg-background/95 backdrop-blur-sm">
        <SidebarTrigger className="shrink-0 text-muted-foreground" />
        <div className="w-px h-4 bg-border mx-0.5 shrink-0" />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <BotIcon className="w-3 h-3 text-primary" />
          </div>

          <span className="text-sm font-medium text-foreground truncate">
            {state.title}
          </span>
        </div>

        <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0 hidden sm:block">
          AI Assistant
        </span>
      </header>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {isPending ? (
          <Loading />
        ) : messages.length > 0 ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
              {messages.map((msg) => {
                return <Message msg={msg} key={msg.id} />;
              })}

              {isThinking && (
                <div className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                    <BotIcon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3.5 shadow-sm">
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:160ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:320ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />

              <div ref={ref}>{isFetching && <Loading size={14} />}</div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 shadow-sm">
              <BotIcon className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-1">
              How can I help you today?
            </h2>
            <p className="text-sm text-muted-foreground mb-8 text-center max-w-xs">
              Ask me anything or pick a suggestion below to get started.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTIONS.map(({ label, prompt }) => (
                <button
                  key={label}
                  onClick={() => handleSuggestion(prompt)}
                  className="group text-left p-3.5 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/20 transition-all duration-150 shadow-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <SparklesIcon className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground leading-snug transition-colors">
                      {label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="shrink-0 border-t bg-background px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background shadow-sm px-3 pt-2.5 pb-2 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 transition-all">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask JBot anything..."
                rows={1}
                className="flex-1 min-h-0 max-h-45 resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:border-0 p-0 text-sm leading-relaxed placeholder:text-muted-foreground/60 dark:bg-background"
              />
              <Button
                size="icon-sm"
                className="shrink-0 rounded-lg"
                disabled={!input.trim() || isThinking}
                onClick={handleSend}
              >
                <SendIcon className="w-3.5 h-3.5" />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground/60 text-center mt-1.5">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConversationPage;
