import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2, Leaf, User } from "lucide-react";
import React from "react";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }
  if (!messages) return <></>;
  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn("flex items-start gap-2.5", {
              "justify-end pl-10": message.role === "user",
              "justify-start pr-10": message.role === "assistant",
            })}
          >
            {/* Avatar for assistant */}
            {message.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            )}

            <div
              className={cn(
                "rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                {
                  "bg-emerald-600/20 text-emerald-50 border border-emerald-500/15":
                    message.role === "user",
                  "bg-secondary/60 text-foreground/90 border border-border/30":
                    message.role === "assistant",
                }
              )}
            >
              <p>{message.content}</p>
            </div>

            {/* Avatar for user */}
            {message.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-emerald-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-emerald-300" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
