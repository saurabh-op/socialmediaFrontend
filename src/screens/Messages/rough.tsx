import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, useEffect } from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreHorizontal,
} from "lucide-react";

import { BackgroundBlobs } from "@/components/feed/BackgroundBlobs";
import { NavRail } from "@/components/feed/NavRail";

const TITLE = "Prism — Chat";
const DESCRIPTION = "A quiet, glassy place to talk.";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [{ title: TITLE }, { name: "description", content: DESCRIPTION }],
  }),
  component: ChatPage,
});

type Message = { id: string; from: "me" | "them"; text: string; time: string };
type Conversation = {
  id: string;
  name: string;
  initials: string;
  accent: "coral" | "azure" | "iris";
  preview: string;
  time: string;
  unread?: number;
  online?: boolean;
  messages: Message[];
};

const seed: Conversation[] = [
  {
    id: "aria",
    name: "Aria Vance",
    initials: "AV",
    accent: "coral",
    preview: "Sent you the dichroic shots ✨",
    time: "12m",
    unread: 2,
    online: true,
    messages: [
      {
        id: "1",
        from: "them",
        text: "Hey! Did you see the new prism series?",
        time: "10:21",
      },
      {
        id: "2",
        from: "me",
        text: "Just opened it. The refraction is unreal.",
        time: "10:23",
      },
      {
        id: "3",
        from: "them",
        text: "Sent you the dichroic shots ✨",
        time: "10:24",
      },
    ],
  },
  {
    id: "roman",
    name: "Roman S.",
    initials: "RS",
    accent: "azure",
    preview: "Transparency is context.",
    time: "1h",
    online: true,
    messages: [
      { id: "1", from: "them", text: "Working on a new piece.", time: "09:02" },
      {
        id: "2",
        from: "them",
        text: "Transparency is context.",
        time: "09:05",
      },
      { id: "3", from: "me", text: "That's a quote.", time: "09:10" },
    ],
  },
  {
    id: "mina",
    name: "Mina Frost",
    initials: "MF",
    accent: "iris",
    preview: "Coffee tomorrow?",
    time: "3h",
    messages: [
      { id: "1", from: "me", text: "Free this week?", time: "Yesterday" },
      { id: "2", from: "them", text: "Coffee tomorrow?", time: "08:14" },
    ],
  },
  {
    id: "leo",
    name: "Leo Park",
    initials: "LP",
    accent: "coral",
    preview: "🎧 new mix dropping",
    time: "1d",
    messages: [
      { id: "1", from: "them", text: "🎧 new mix dropping", time: "Mon" },
    ],
  },
  {
    id: "noa",
    name: "Noa Kim",
    initials: "NK",
    accent: "azure",
    preview: "Thanks!",
    time: "2d",
    messages: [
      { id: "1", from: "me", text: "Sending the file now.", time: "Sun" },
      { id: "2", from: "them", text: "Thanks!", time: "Sun" },
    ],
  },
];

const accentBg: Record<Conversation["accent"], string> = {
  coral: "from-[var(--coral)] to-pink-500",
  azure: "from-[var(--azure)] to-indigo-500",
  iris: "from-[var(--iris)] to-purple-500",
};

function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(seed);
  const [activeId, setActiveId] = useState<string>(seed[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId)!;

  const filtered = useMemo(
    () =>
      conversations.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.preview.toLowerCase().includes(query.toLowerCase()),
      ),
    [conversations, query],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [active.messages.length, activeId]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setConversations((cs) =>
      cs.map((c) =>
        c.id === activeId
          ? {
              ...c,
              preview: text,
              time: "now",
              messages: [
                ...c.messages,
                { id: crypto.randomUUID(), from: "me", text, time },
              ],
            }
          : c,
      ),
    );
    setDraft("");
  }

  return (
    <div className="relative flex min-h-screen justify-center font-sans text-foreground">
      <BackgroundBlobs />
      <NavRail />

      <main
        className="relative z-10 mx-auto flex h-screen w-full max-w-[1200px] gap-5 px-6 py-6 pl-28 opacity-0"
        style={{ animation: "entrance 0.7s var(--ease-studio) both" }}
      >
        {/* Chat list */}
        <aside className="glass-core flex w-[320px] shrink-0 flex-col rounded-[2rem] p-4">
          <h2 className="px-2 pb-3 pt-1 text-lg font-semibold tracking-tight">
            Messages
          </h2>
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full rounded-full border border-white/60 bg-white/40 py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-foreground/40 focus:bg-white/70"
            />
          </div>
          <div className="-mx-1 flex flex-1 flex-col gap-1 overflow-y-auto px-1">
            {filtered.map((c) => {
              const isActive = c.id === activeId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={
                    "flex items-center gap-3 rounded-2xl p-3 text-left transition-colors " +
                    (isActive ? "bg-white/70 shadow-sm" : "hover:bg-white/40")
                  }
                >
                  <div className="relative">
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accentBg[c.accent]} text-xs font-bold text-white shadow-md`}
                    >
                      {c.initials}
                    </div>
                    {c.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-emerald-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold tracking-tight">
                        {c.name}
                      </span>
                      <span className="shrink-0 text-[11px] text-foreground/45">
                        {c.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-foreground/55">
                        {c.preview}
                      </span>
                      {c.unread ? (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--coral)] text-[10px] font-bold text-white">
                          {c.unread}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-foreground/40">
                No conversations
              </div>
            )}
          </div>
        </aside>

        {/* Open chat */}
        <section className="glass-core flex flex-1 flex-col overflow-hidden rounded-[2rem]">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-white/40 px-6 py-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${accentBg[active.accent]} text-xs font-bold text-white shadow-md`}
              >
                {active.initials}
              </div>
              <div>
                <div className="text-sm font-semibold tracking-tight">
                  {active.name}
                </div>
                <div className="text-[11px] text-foreground/50">
                  {active.online ? "Online now" : "Last seen recently"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-foreground/55">
              <button className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/50">
                <Phone className="size-4" />
              </button>
              <button className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/50">
                <Video className="size-4" />
              </button>
              <button className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/50">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-6 py-6"
          >
            {active.messages.map((m) => {
              const mine = m.from === "me";
              return (
                <div
                  key={m.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={
                      "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm " +
                      (mine
                        ? "rounded-br-md bg-foreground text-background"
                        : "rounded-bl-md border border-white/60 bg-white/70 text-foreground")
                    }
                  >
                    <div>{m.text}</div>
                    <div
                      className={
                        "mt-1 text-[10px] " +
                        (mine ? "text-background/60" : "text-foreground/45")
                      }
                    >
                      {m.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer */}
          <div className="border-t border-white/40 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-2 py-1.5"
            >
              <button
                type="button"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground/55 transition-colors hover:bg-white/70"
                aria-label="Attach"
              >
                <Paperclip className="size-4" />
              </button>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${active.name.split(" ")[0]}`}
                className="flex-1 border-none bg-transparent px-1 text-sm outline-none placeholder:text-foreground/40"
              />
              <button
                type="button"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground/55 transition-colors hover:bg-white/70"
                aria-label="Emoji"
              >
                <Smile className="size-4" />
              </button>
              <button
                type="submit"
                disabled={!draft.trim()}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                aria-label="Send"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
