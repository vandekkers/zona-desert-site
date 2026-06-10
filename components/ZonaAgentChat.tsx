"use client";

// Phase 5.5.c — Zona Agent client island.
//
// Floating launcher (bottom-right) → chat panel (mobile: full-width
// bottom sheet). Stateless V1 — full conversation history kept in
// component state and sent to the backend on every turn. No persistence,
// no streaming.
//
// Failure surfacing matches the backend contract:
//   503 agent_offline → "The agent is offline right now — try the
//                        Bid & Buy tab or contact us."
//   502 agent_unavailable → "The Zona Agent ran into an issue. Try
//                            again in a moment."
//   429              → "Lots of questions right now — one moment."
//   404 / 422 / net   → generic retry copy.
//
// SSR safety: this component is "use client" but the listing detail
// page mounts it via a dynamic import with ssr:false so the server-
// rendered marketing surface (status badge, hero, pricing) is never
// blocked by the chat bundle.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ZonaAgentChatError,
  sendListingChat
} from "@/lib/publicApi";
import type {
  ZonaAgentChatErrorKind,
  ZonaAgentChatMessage
} from "@/lib/types";

// Per-message cap mirrors the backend ``MAX_CHARS_PER_MESSAGE`` from
// app/schemas/public_chat.py — surfaced here so the textarea can
// hard-stop input before a 422 round-trip.
const MAX_CHARS_PER_MESSAGE = 1000;

interface ZonaAgentChatProps {
  slug: string;
  listingLabel: string;
}

interface DisplayMessage extends ZonaAgentChatMessage {
  /** Stable client-side id for React keys. */
  id: string;
  /** When true, the assistant content is the "typing…" placeholder. */
  typing?: boolean;
}

const WELCOME_TEXT =
  "Hi! I'm the Zona Agent. Ask me anything about this listing — beds and baths, exit strategies, financials, or how the Bid & Buy flow works.";

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function errorCopy(kind: ZonaAgentChatErrorKind): string {
  switch (kind) {
    case "offline":
      return "The Zona Agent is offline right now. Try the Bid & Buy tab or use Contact Us for help.";
    case "rate_limited":
      return "Lots of questions right now — please try again in a moment.";
    case "validation":
      return "That message didn't make it through. Try shortening it and send again.";
    case "not_found":
      return "This listing isn't available for chat right now.";
    case "network":
      return "Connection hiccup. Check your network and try again.";
    case "unavailable":
    default:
      return "The Zona Agent ran into an issue. Try again in a moment.";
  }
}

export default function ZonaAgentChat({ slug, listingLabel }: ZonaAgentChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME_TEXT }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Scroll to bottom on every new message so the user always sees the
  // latest reply. Guarded with optional chaining so SSR + initial
  // render (when ref is null) stay safe.
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Focus the textarea when the panel opens so the user can start
  // typing immediately.
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  // ESC closes the panel (when not actively sending).
  useEffect(() => {
    if (!open) return undefined;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !sending) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, sending]);

  // Wire history → backend on send.
  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setErrorMessage(null);

    const userMsg: DisplayMessage = {
      id: makeId(),
      role: "user",
      content: trimmed
    };
    const typingMsg: DisplayMessage = {
      id: "typing",
      role: "assistant",
      content: "Zona Agent is typing…",
      typing: true
    };

    // Append optimistically so the conversation feels responsive.
    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setInput("");
    setSending(true);

    // Build the wire payload from the durable history (welcome + prior
    // turns + new user message). The "typing" placeholder is never
    // sent; the backend cap is per-CONTENT length so it must not
    // appear in the payload either.
    const wireMessages: ZonaAgentChatMessage[] = [
      ...messages
        .filter((m) => !m.typing && m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: trimmed }
    ];

    try {
      const { reply } = await sendListingChat(slug, wireMessages);
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== "typing")
          .concat({ id: makeId(), role: "assistant", content: reply })
      );
    } catch (err) {
      const chatErr =
        err instanceof ZonaAgentChatError
          ? err
          : new ZonaAgentChatError("unavailable", "unknown error");
      setMessages((prev) => prev.filter((m) => m.id !== "typing"));
      setErrorMessage(errorCopy(chatErr.kind));
    } finally {
      setSending(false);
    }
  }, [input, messages, sending, slug]);

  // Enter to send, Shift+Enter for newline.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleSend();
      }
    },
    [handleSend]
  );

  const charCount = input.length;
  const overLimit = charCount > MAX_CHARS_PER_MESSAGE;

  const launcherLabel = useMemo(
    () => `Ask the Zona Agent about ${listingLabel}`,
    [listingLabel]
  );

  return (
    <>
      {/* Floating launcher */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={launcherLabel}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-zona-purple px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-zona-purple/30 transition hover:bg-zona-purple-deep focus:outline-none focus:ring-2 focus:ring-zona-purple focus:ring-offset-2"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 0 1-4.255-.949L3 20l1.39-3.687A7.94 7.94 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
            />
          </svg>
          <span>Ask Zona Agent</span>
        </button>
      ) : null}

      {/* Chat panel */}
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Zona Agent chat"
          className="fixed bottom-0 right-0 z-50 flex h-[80vh] w-full flex-col rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:h-[32rem] sm:w-[26rem] sm:rounded-3xl"
        >
          {/* Header */}
          <header className="flex items-center justify-between rounded-t-3xl bg-zona-purple px-5 py-3 text-white">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm font-bold"
              >
                Z
              </span>
              <div>
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{ fontFamily: "var(--font-sora, 'Sora', sans-serif)" }}
                >
                  Zona Agent
                </p>
                <p className="text-xs text-white/80">Listing assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 text-white/90 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          {/* Messages */}
          <div
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
            style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-zona-purple px-4 py-2 text-sm text-white"
                      : msg.typing
                        ? "max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2 text-sm italic text-slate-500"
                        : "max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2 text-sm text-slate-900"
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {errorMessage ? (
              <div role="alert" className="rounded-xl bg-zona-amber/15 px-3 py-2 text-xs font-semibold text-zona-navy">
                {errorMessage}
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div className="border-t border-slate-200 p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS_PER_MESSAGE))}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this listing…"
                rows={2}
                disabled={sending}
                aria-label="Type your message"
                className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-zona-purple focus:bg-white focus:outline-none focus:ring-2 focus:ring-zona-purple/40 disabled:opacity-60"
                style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}
              />
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={sending || input.trim().length === 0 || overLimit}
                aria-label="Send message"
                className="rounded-full bg-zona-purple px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zona-purple-deep disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? "…" : "Send"}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              {sending
                ? "Sending…"
                : `${charCount}/${MAX_CHARS_PER_MESSAGE} characters. Enter to send · Shift+Enter for newline`}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
