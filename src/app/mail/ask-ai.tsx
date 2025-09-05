"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Send, SparklesIcon } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { cn } from "@/lib/utils";
import PremiumBanner from "./premium-banner";
import { api } from "@/trpc/react";

const AskAI = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const [input, setInput] = React.useState("");
  const [accountId] = useLocalStorage("accountId", "");
  const utils = api.useUtils();
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        accountId,
      },
    }),
    onError: (error) => {
      if (error.message.includes("Limit reached")) {
        toast.error(
          "You have reached the limit for today. Please upgrade to pro to ask as many questions as you want",
        );
      }
    },
    onFinish: () => {
      utils.mail.getChatbotInteraction.refetch();
    },
    messages: [],
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (isCollapsed) return null;

  const lastMessage = messages[messages.length - 1];
  const isAssistantStreaming = lastMessage?.role === "user" && !error;

  return (
    <div className="mb-14 p-4">
      <PremiumBanner />
      <div className="h-4"></div>
      <motion.div className="flex flex-1 flex-col items-end justify-end rounded-lg border bg-gray-100 p-4 pb-4 shadow-inner dark:bg-gray-900">
        <div
          className="flex max-h-[50vh] w-full flex-col gap-2 overflow-y-scroll"
          id="message-container"
        >
          <AnimatePresence mode="sync">
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                layout="position"
                className={cn(
                  "z-10 mt-2 max-w-[250px] rounded-2xl bg-gray-400 break-words dark:bg-gray-800",
                  {
                    "self-end text-gray-900 dark:text-gray-100":
                      message.role === "user",
                    "self-start bg-blue-700 text-white":
                      message.role === "assistant",
                  },
                )}
                layoutId={`container-[${messages.length - 1}]`}
                animate={{ opacity: 0.8 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                {message.parts.map((part, i) => {
                  console.log("Ask ai , message.parts", message.parts);
                  if (part.type === "text") {
                    return (
                      <div
                        key={i}
                        className="px-3 py-2 text-[15px] leading-[15px]"
                      >
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => (
                              <p className="" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-semibold" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul
                                className="list-inside list-disc space-y-1"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="leading-relaxed" {...props} />
                            ),
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>{" "}
                      </div>
                    );
                  }

                  if (
                    part.type === "file" &&
                    part.mediaType.startsWith("image/")
                  ) {
                    return (
                      <img
                        key={i}
                        src={part.url}
                        alt="Generated image"
                        className="mt-2 max-w-full rounded-lg"
                      />
                    );
                  }

                  return null;
                })}
              </motion.div>
            ))}
            {/* Loader for assistant typing */}
            {isAssistantStreaming && (
              <motion.div
                layout="position"
                className={cn(
                  "z-10 mt-2 max-w-[250px] self-start rounded-2xl bg-blue-700 break-words text-white dark:bg-gray-800",
                )}
                animate={{ opacity: 0.8 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "easeInOut",
                }}
              >
                <div className="flex space-x-1 px-3 py-2 text-[15px] leading-[15px]">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-150">●</span>
                  <span className="animate-bounce delay-300">●</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {messages.length > 0 && <div className="h-4"></div>}
        <div className="w-full">
          {messages.length === 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <SparklesIcon className="size-6 text-gray-500" />
                <div>
                  <p className="text-gray-900 dark:text-gray-100">
                    Ask AI anything about your emails
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get answers to your questions about your emails
                  </p>
                </div>
              </div>
              <div className="h-2"></div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  onClick={() => setInput("What can I ask?")}
                  className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-200"
                >
                  What can I ask?
                </span>
                <span
                  onClick={() => setInput("When is my next flight?")}
                  className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-200"
                >
                  When is my next flight?
                </span>
                <span
                  onClick={() => setInput("When is my next meeting?")}
                  className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-200"
                >
                  When is my next meeting?
                </span>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex w-full">
            <input
              type="text"
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== "ready"}
              value={input}
              className="py- relative h-9 flex-grow rounded-full border border-gray-200 bg-white px-3 text-[15px] outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:ring-blue-500/20 dark:focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-700"
              placeholder="Ask AI anything about your emails"
            />
            <motion.div
              key={messages.length}
              layout="position"
              className="pointer-events-none absolute z-10 flex h-9 w-[250px] items-center overflow-hidden rounded-full bg-gray-200 break-words [word-break:break-word] dark:bg-gray-800"
              layoutId={`container-[${messages.length}]`}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              initial={{ opacity: 0.6, zIndex: -1 }}
              animate={{ opacity: 0.6, zIndex: -1 }}
              exit={{ opacity: 1, zIndex: 1 }}
            >
              <div className="px-3 py-2 text-[15px] leading-[15px] text-gray-900 dark:text-gray-100">
                {input}
              </div>
            </motion.div>
            <button
              type="submit"
              disabled={status !== "ready"}
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800"
            >
              <Send className="size-4 text-gray-500 dark:text-gray-300" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export { AskAI };
