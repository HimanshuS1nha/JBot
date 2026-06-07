import { BotIcon } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";

const HomePage = () => {
  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-background">
      <header className="flex items-center gap-2 h-12 px-3 border-b shrink-0 bg-background/95 backdrop-blur-sm">
        <SidebarTrigger className="shrink-0 text-muted-foreground" />
        <div className="w-px h-4 bg-border mx-0.5 shrink-0" />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-medium text-foreground truncate">
            JBot
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 shadow-sm">
            <BotIcon className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            How can I help you today?
          </h2>
          <p className="text-sm text-muted-foreground mb-8 text-center max-w-xs">
            Ask me anything or pick a conversation from the left to get started.
          </p>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
