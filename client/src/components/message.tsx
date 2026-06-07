import { BotIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

import type { MessageType } from "@/types";

type Props = {
  msg: MessageType;
};

const Message = ({ msg }: Props) => {
  return (
    <>
      {msg.role === "User" ? (
        <div key={msg.id} className="flex justify-end">
          <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-4 py-2.5 shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {msg.content}
            </p>
          </div>
        </div>
      ) : (
        <div key={msg.id} className="flex gap-2.5 items-start">
          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0 mt-0.5">
            <BotIcon className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="max-w-[78%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 shadow-sm text-sm leading-relaxed">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
