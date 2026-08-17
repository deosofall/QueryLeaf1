"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send, Leaf } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });
  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div
      className="relative max-h-screen overflow-scroll bg-background scrollbar-dark"
      id="message-container"
    >
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-3 glass h-fit z-10 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-foreground font-outfit">
            Chat
          </h3>
        </div>
      </div>

      {/* message list */}
      <MessageList messages={messages} isLoading={isLoading} />

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-3 py-3 glass border-t border-border/50"
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all duration-200"
          />
          <Button className="bg-emerald-500 hover:bg-emerald-400 text-background transition-all duration-200 flex-shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
