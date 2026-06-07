"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bot, Send, RotateCcw, WifiOff } from "lucide-react";
import { useOffline } from "@/hooks/useOffline";
import { cn } from "@/lib/cn";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

type Status = "idle" | "streaming" | "error";

function TypingDots() {
  return (
    <span className="inline-flex gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export default function HelpChat() {
  const t = useTranslations("Help");
  const locale = useLocale();
  const offline = useOffline();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const endRef = useRef<HTMLDivElement>(null);

  const busy = status === "streaming";
  const started = messages.length > 0;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    setInput("");
    setStatus("streaming");
    const history: Msg[] = [...messages, { role: "user", content: clean }];
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, locale }),
      });
      if (!res.ok || !res.body) throw new Error("request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((cur) => {
          const next = cur.slice();
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      }
      if (!acc.trim()) throw new Error("empty response");
      setStatus("idle");
    } catch {
      // Drop the empty assistant placeholder; keep the user turn for retry.
      setMessages((cur) =>
        cur.filter(
          (m, i) =>
            !(i === cur.length - 1 && m.role === "assistant" && !m.content),
        ),
      );
      setStatus("error");
    }
  }

  const suggestionKeys = ["transport", "baggage", "events", "taxi"] as const;

  return (
    <div className="flex h-[calc(100svh-11rem)] flex-col">
      <header className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-muted text-accent">
            <Bot size={18} aria-hidden />
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight text-ink">{t("title")}</h1>
            <p className="text-xs text-ink-faint">{t("subtitle")}</p>
          </div>
        </div>
        {started && (
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setStatus("idle");
            }}
            className="grid h-11 w-11 place-items-center rounded-xl text-ink-faint transition active:scale-95"
            aria-label={t("newChat")}
          >
            <RotateCcw size={18} aria-hidden />
          </button>
        )}
      </header>

      <div
        className="flex-1 space-y-3 overflow-y-auto pb-2"
        aria-live="polite"
        aria-label={t("title")}
      >
        {/* Greeting (presentational; not sent to the model) */}
        <Bubble role="assistant">{t("greeting")}</Bubble>

        {!started && (
          <div className="space-y-2 pt-1">
            <p className="px-1 text-xs font-medium text-ink-faint">
              {t("suggestionsTitle")}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestionKeys.map((k) => {
                const q = t(`suggestions.${k}`);
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => send(q)}
                    disabled={offline}
                    className="rounded-full border border-line bg-surface px-3 py-2 text-left text-[13px] text-ink-soft transition active:scale-95 disabled:opacity-50"
                  >
                    {q}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          const isLast = i === messages.length - 1;
          if (m.role === "assistant" && !m.content && busy && isLast) {
            return (
              <Bubble key={i} role="assistant">
                <TypingDots />
              </Bubble>
            );
          }
          return (
            <Bubble key={i} role={m.role}>
              {m.content}
            </Bubble>
          );
        })}

        {status === "error" && (
          <p role="alert" className="px-1 text-xs text-red-400">
            {t("error")}
          </p>
        )}
        <div ref={endRef} />
      </div>

      {offline ? (
        <p className="flex items-center justify-center gap-1.5 rounded-2xl border border-line bg-surface px-4 py-3 text-center text-xs text-ink-faint">
          <WifiOff size={14} aria-hidden /> {t("offline")}
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 pt-1"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            aria-label={t("inputPlaceholder")}
            enterKeyHint="send"
            className="min-h-[44px] flex-1 rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || busy}
            aria-label={t("send")}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-accent-ink transition active:scale-95 disabled:opacity-40"
          >
            <Send size={18} aria-hidden />
          </button>
        </form>
      )}

      <p className="pt-2 text-center text-[10px] text-ink-faint">
        {t("disclaimer")}
      </p>
    </div>
  );
}

function parseMarkdown(text: string) {
  const parts: React.ReactNode[] = [];

  // Split by paragraphs first
  const paragraphs = text.split(/\n\n+/);

  paragraphs.forEach((para, pIdx) => {
    const lines = para.split("\n");
    const pContent: React.ReactNode[] = [];

    lines.forEach((line, lIdx) => {
      // List items: "- item"
      if (line.match(/^\s*-\s/)) {
        pContent.push(
          <div key={`${pIdx}-${lIdx}`} className="flex gap-2">
            <span className="shrink-0">•</span>
            <span>{renderInlineMarkdown(line.replace(/^\s*-\s/, ""))}</span>
          </div>,
        );
      } else {
        // Headings: "# heading"
        if (line.match(/^#+\s/)) {
          const level = line.match(/^#+/)?.[0].length ?? 2;
          const headingText = line.replace(/^#+\s/, "");
          const headingClass =
            level === 1
              ? "font-bold text-base"
              : level === 2
                ? "font-bold"
                : "font-semibold text-sm";
          pContent.push(
            <div key={`${pIdx}-${lIdx}`} className={`${headingClass} mt-2`}>
              {renderInlineMarkdown(headingText)}
            </div>,
          );
        } else if (line.trim()) {
          pContent.push(
            <div key={`${pIdx}-${lIdx}`}>{renderInlineMarkdown(line)}</div>,
          );
        }
      }
    });

    if (pContent.length > 0) {
      parts.push(
        <div key={`para-${pIdx}`} className="space-y-1">
          {pContent}
        </div>,
      );
    }
  });

  return parts;
}

function renderInlineMarkdown(text: string): React.ReactNode {
  const segments: React.ReactNode[] = [];
  let lastIdx = 0;

  // Match **bold** and *italic*
  const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIdx) {
      segments.push(text.slice(lastIdx, match.index));
    }

    // Add matched bold or italic
    if (match[1]) {
      segments.push(
        <strong key={`bold-${match.index}`}>{match[1]}</strong>,
      );
    } else if (match[2]) {
      segments.push(
        <em key={`italic-${match.index}`}>{match[2]}</em>,
      );
    }

    lastIdx = regex.lastIndex;
  }

  // Add remaining text
  if (lastIdx < text.length) {
    segments.push(text.slice(lastIdx));
  }

  return segments.length > 0 ? segments : text;
}

function Bubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  const content =
    typeof children === "string" ? parseMarkdown(children) : children;

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed",
          isUser
            ? "rounded-br-md bg-accent text-accent-ink"
            : "rounded-bl-md border border-line bg-surface text-ink space-y-2",
        )}
      >
        {content}
      </div>
    </div>
  );
}
