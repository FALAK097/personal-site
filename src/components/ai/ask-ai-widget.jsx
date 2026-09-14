"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { askFalakAI } from "@/actions/ask-ai";
import { cn } from "@/lib/utils";
import {
  ExpandableChat,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "./expandable-chat";
import { ChatMessageList } from "./chat-message-list";
import { ChatBubble, ChatBubbleMessage } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { PromptSuggestions } from "./prompt-suggestions";
import { SlashCommandMenu } from "./slash-command-menu";
import { SendIcon, SquareIcon } from "../icons";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";

const slashCommands = [
  {
    command: "/about",
    question: "Tell me about Falak.",
    description:
      "Learn about Falak's background and experience in software development, keep it concise",
  },
  {
    command: "/contact",
    question: "How can I contact Falak?",
    description:
      "Get Falak's contact information including email, social media, cal.com link, and more",
  },
  {
    command: "/projects",
    question: "What projects has Falak worked on?",
    description:
      "Explore Falak's portfolio and projects, only project names and links will be provided, go to https://falakgala.dev/projects to see the project details",
  },
  {
    command: "/writing",
    question: "What are Falak's latest articles?",
    description: "Discover Falak's latest articles and insights",
  },
  {
    command: "/help",
    question: "What can I ask you?",
    description:
      "Learn what you can ask the AI assistant, provide  a list of commands",
  },
];

export const AskAIWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hi! I'm Falak's AI Persona. Ask me anything about him! ✨",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canStop, setCanStop] = useState(false);
  const [isPending, startTransition] = useTransition();
  const intervalRef = useRef(null);
  const inputRef = useRef(null);

  const matchingCommands = input.startsWith("/")
    ? slashCommands.filter((cmd) =>
      cmd.command.toLowerCase().startsWith(input.toLowerCase())
    )
    : [];

  const showSuggestions = messages.length <= 1 && !input.trim();

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [open]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [input]);

  const stopGeneration = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCanStop(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isPending) return;

    let question = input.trim();
    const match = slashCommands.find((cmd) => cmd.command === question);
    if (match) question = match.question;

    const userMessage = {
      id: messages.length + 1,
      content: question,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const history = [...messages.slice(1), userMessage];

    startTransition(async () => {
      try {
        const res = await askFalakAI(question, history);
        if (!res || typeof res !== "string") {
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              content: "Something went wrong. Please try again.",
              sender: "ai",
            },
          ]);
          return;
        }

        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, content: "", sender: "ai" },
        ]);
        setCanStop(true);

        let i = 0;
        let answer = "";
        intervalRef.current = setInterval(() => {
          answer += res[i];
          i++;
          if (i >= res.length && intervalRef.current) {
            clearInterval(intervalRef.current);
            setCanStop(false);
          }
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { id: prev.length, content: answer, sender: "ai" },
          ]);
        }, 25);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            content: "Something went wrong. Please try again.",
            sender: "ai",
          },
        ]);
        setCanStop(false);
      }
    });
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
      return;
    }

    if (input.startsWith("/") && matchingCommands.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % matchingCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + matchingCommands.length) % matchingCommands.length
        );
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (matchingCommands[selectedIndex]) {
          setInput(matchingCommands[selectedIndex].question);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setInput("");
      }
    }
  };

  const handleCommandSelect = (command) => {
    setInput(command.question);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.text);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const linkifyText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          className="underline text-clay-600 hover:text-clay-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ExpandableChat
        open={open}
        onOpenChange={setOpen}
        size="lg"
        position="bottom-right"
      >
        <ExpandableChatBody>
          <ChatMessageList>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.sender === "user" ? "sent" : "received"}
              >
                <ChatBubbleMessage
                  variant={message.sender === "user" ? "sent" : "received"}
                  className="break-words whitespace-pre-wrap"
                  rawMessage={message.content}
                >
                  {message.sender === "user" ? (
                    linkifyText(message.content)
                  ) : (
                    <div className="prose dark:prose-invert max-w-none text-sm leading-[1.6]">
                      <Streamdown linkSafety={{ enabled: false }}>{message.content}</Streamdown>
                    </div>
                  )}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}
          </ChatMessageList>
        </ExpandableChatBody>

        <ExpandableChatFooter className="space-y-4">
          {showSuggestions && (
            <PromptSuggestions onSuggestionClick={handleSuggestionClick} />
          )}

          <div className="relative">
            <form
              onSubmit={handleSubmit}
              className="relative rounded-xl border border-clay-200 dark:border-clay-400 focus-within:ring-2 focus-within:ring-clay-500 focus-within:border-transparent p-1 shadow-sm"
            >
              <SlashCommandMenu
                commands={matchingCommands}
                selectedIndex={selectedIndex}
                onSelect={handleCommandSelect}
              />

              <ChatInput
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a question or use / for commands..."
                className="min-h-12 resize-none rounded-xl bg-transparent border-0 p-3 pr-20 shadow-none focus-visible:ring-0"
                disabled={isPending}
              />

              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {input.trim() && !isPending && (
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}+↵
                  </div>
                )}
                {canStop ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={stopGeneration}
                    className="gap-1.5 bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <SquareIcon className="size-3.5" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim() || isPending}
                    className={cn(
                      "gap-1.5 bg-gradient-to-r from-clay-600 to-violet-600 hover:from-clay-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer",
                      isPending && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <SendIcon className="size-3.5" />
                    {isPending ? "Sending" : "Send"}
                  </Button>
                )}
              </div>
            </form>

            <div className="flex items-center justify-between mt-2 px-1">
              <div className="text-xs text-muted-foreground">
                Try typing{" "}
                <code className="bg-clay-100 dark:bg-clay-900 px-1 rounded">
                  /
                </code>{" "}
                for quick commands
              </div>
              <div className="text-xs text-muted-foreground">
                <kbd className="px-1 rounded text-xs">Esc</kbd> to close
              </div>
            </div>
          </div>
        </ExpandableChatFooter>
      </ExpandableChat>
    </div>
  );
};
