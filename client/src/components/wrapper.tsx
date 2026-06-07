import { Outlet } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";
import ConversationSidebar from "./conversation-sidebar";

const Wrapper = () => {
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <ConversationSidebar />
      <Outlet />
    </SidebarProvider>
  );
};

export default Wrapper;
