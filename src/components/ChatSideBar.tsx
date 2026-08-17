"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import SubscriptionButton from "./SubscriptionButton";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="w-full h-screen flex flex-col glass p-4 scrollbar-dark overflow-hidden">
      {/* Brand */}
      <div className="flex items-center gap-2 mb-6 px-1">
        <Leaf className="w-6 h-6 text-emerald-500 flex-shrink-0" />
        <span className="text-lg font-outfit font-bold text-foreground tracking-tight">
          Query<span className="text-gradient-emerald">Leaf</span>
        </span>
      </div>

      {/* New Chat Button */}
      <Link href="/">
        <Button className="w-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 mb-4">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-dark pb-4 flex flex-col gap-1.5">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn(
                "rounded-lg p-3 flex items-center transition-all duration-200 group cursor-pointer",
                {
                  "bg-emerald-500/15 text-emerald-300 glow-emerald-sm border border-emerald-500/20":
                    chat.id === chatId,
                  "text-muted-foreground hover:text-foreground hover:bg-secondary/60":
                    chat.id !== chatId,
                }
              )}
            >
              <MessageCircle
                className={cn("mr-2.5 w-4 h-4 flex-shrink-0", {
                  "text-emerald-400": chat.id === chatId,
                  "text-muted-foreground group-hover:text-emerald-400/60":
                    chat.id !== chatId,
                })}
              />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-border/50">
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default ChatSideBar;
