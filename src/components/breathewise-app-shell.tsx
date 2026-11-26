import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Bot,
  CalendarClock,
  CloudSun,
  Gauge,
  Globe,
  House,
  Leaf,
  Loader2,
  MapPin,
  MessageCircle,
  Navigation,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { MarkdownText } from "@/components/markdown-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAqiLevel } from "@/constants/aqi-standards";
import { AirQualityProvider, useAirQuality } from "@/contexts/air-quality-context";
import { AiService } from "@/services/ai.service";
import type { ChatMessage } from "@/types/ai.types";

const navItems = [
  { to: "/dashboard" as const, label: "Air quality", icon: Activity },
  { to: "/forecast" as const, label: "Forecast", icon: CloudSun },
  { to: "/map" as const, label: "Pollution Map", icon: Globe },
  { to: "/exposure" as const, label: "Exposure", icon: Gauge },
  { to: "/alerts" as const, label: "Alerts", icon: Bell },
  { to: "/routes" as const, label: "Clean Routes", icon: Navigation },
  { to: "/planner" as const, label: "Daily planner", icon: CalendarClock },
  { to: "/indoor-air" as const, label: "Indoor air", icon: House },
  { to: "/travel" as const, label: "Green travel", icon: Route },
  { to: "/impact" as const, label: "My impact", icon: Leaf },
  { to: "/community" as const, label: "Community", icon: Users },
];

export function BreatheWiseAppShell({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={250}>
      <AirQualityProvider>
        <AppShellContent>{children}</AppShellContent>
      </AirQualityProvider>
    </TooltipProvider>
  );
}

function AppShellContent({ children }: { children: React.ReactNode }) {
  const { currentAirData, standard } = useAirQuality();
  const [chatOpen, setChatOpen] = useState(false);
  const level = getAqiLevel(currentAirData.aqi, standard);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <BrandMark />

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Data Source Pill */}
            <span
              className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold sm:inline-flex ${
                currentAirData.isLive
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  currentAirData.isLive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              {currentAirData.isLive ? "LIVE SENSOR" : "REFERENCE BASELINE"}
            </span>

            {/* Active City & AQI Pill (visible on all viewports) */}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs transition-colors hover:border-primary/40"
              title={`Active city: ${currentAirData.city}`}
            >
              <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
              <span className="max-w-[90px] truncate sm:max-w-none">{currentAirData.city}</span>
              <span className="text-muted-foreground">·</span>
              <span className={`font-semibold tabular-nums ${level.colorClass}`}>
                {currentAirData.aqi}
              </span>
              <span className="hidden text-[11px] text-muted-foreground md:inline">
                ({standard === "INDIA_CPCB" ? "CPCB" : "EPA"})
              </span>
            </Link>

            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setChatOpen((prev) => !prev)}
              className="hidden h-8 gap-1.5 rounded-full px-3 text-xs font-semibold md:inline-flex"
            >
              <Sparkles aria-hidden="true" className="size-3.5 text-primary" />
              AI Assistant
            </Button>
          </div>
        </div>

        <nav
          aria-label="BreatheWise sections"
          className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 pb-2.5 sm:px-5"
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: true }}
              activeProps={{
                className:
                  "bg-secondary text-secondary-foreground font-semibold shadow-2xs ring-1 ring-primary/15",
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-7 sm:px-6 sm:pt-9">{children}</main>

      <footer className="mt-8 border-t border-border bg-muted/35 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>BreatheWise · Breathe better. Live smarter. Build cleaner communities.</span>
          <span>
            Standards: Indian CPCB NAQI &amp; US EPA AQI · Transparent baseline &amp; live
            telemetry.
          </span>
        </div>
      </footer>

      <ChatAssistant open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}

function ChatAssistant({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { currentAirData, profile } = useAirQuality();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `Hello! I am your BreatheWise Environmental Health Assistant, tuned to **${currentAirData.city}** (Current AQI: **${currentAirData.aqi} · ${currentAirData.category}**). Ask me about outdoor exercise, window ventilation, mask guidance, or low-emission commuting.`,
      timestamp: "Now",
      contextApplied: {
        city: currentAirData.city,
        aqi: currentAirData.aqi,
        category: currentAirData.category,
      },
    },
  ]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  const handleSend = async (queryText: string) => {
    const text = queryText.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setIsTyping(true);

    try {
      const response = await AiService.generateChatResponse(
        text,
        currentAirData,
        profile,
        messages,
      );
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isAi: true,
        contextApplied: {
          city: currentAirData.city,
          aqi: currentAirData.aqi,
          category: currentAirData.category,
        },
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "I encountered a temporary error reaching the assistant service. Please try your question again.",
          timestamp: "Now",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend(draft);
  };

  const quickPrompts = [
    "Is it safe to go jogging today?",
    "What is the air quality forecast for today?",
    "Recommend a clean walking route.",
    "How do I lower my personal exposure score?",
    "How can I protect my family from PM2.5?",
    "What should I do when AQI becomes hazardous?",
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open ? (
        <section
          id="breathewise-chat"
          role="dialog"
          aria-label="BreatheWise AI Health Assistant"
          className="flex h-[min(580px,calc(100svh-5.5rem))] w-[min(27rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <Bot aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <span>BreatheWise Assistant</span>
                  <Sparkles aria-hidden="true" className="size-3.5 text-amber-500" />
                </p>
                <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                  <MapPin aria-hidden="true" className="size-2.5 shrink-0 text-primary" />
                  <span className="truncate">
                    {currentAirData.city} · AQI {currentAirData.aqi} ({currentAirData.category})
                  </span>
                </p>
              </div>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
              className="size-8 rounded-lg"
            >
              <X aria-hidden="true" className="size-4" />
            </Button>
          </div>

          {/* Messages list */}
          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            className="flex-1 space-y-4 overflow-y-auto p-4"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 ${
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground text-[13px] leading-relaxed"
                      : "rounded-bl-sm border border-border/70 bg-muted/65 text-foreground"
                  }`}
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-line">{m.text}</p>
                  ) : (
                    <MarkdownText content={m.text} />
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 px-1 text-[10px] text-muted-foreground">
                  <span>{m.timestamp}</span>
                  {m.role === "assistant" && m.contextApplied && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-1.5 py-0.5 text-[9px] font-semibold text-secondary-foreground">
                      <ShieldCheck aria-hidden="true" className="size-2.5" />
                      {m.contextApplied.city} · AQI {m.contextApplied.aqi}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex w-fit items-center gap-2 rounded-xl border border-border/60 bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                <Loader2 aria-hidden="true" className="size-3.5 animate-spin text-primary" />
                Analyzing air conditions for {currentAirData.city}...
              </div>
            )}

            {/* Suggested Question Chips */}
            <div className="pt-1">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Suggested Questions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={isTyping}
                    onClick={() => handleSend(prompt)}
                    className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-left text-[11px] font-medium text-foreground transition-colors hover:border-primary/45 hover:bg-secondary/60 disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Ask about ${currentAirData.city}'s air...`}
              aria-label="Message BreatheWise AI"
              disabled={isTyping}
              className="rounded-xl text-sm"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send message"
              disabled={!draft.trim() || isTyping}
              className="shrink-0 rounded-xl"
            >
              <Send aria-hidden="true" className="size-4" />
            </Button>
          </form>

          <p className="border-t border-border bg-muted/25 px-3 py-1.5 text-center text-[10px] text-muted-foreground">
            Advice uses active city readings · Never fabricates sensor measurements
          </p>
        </section>
      ) : null}

      <Button
        type="button"
        aria-expanded={open}
        aria-controls="breathewise-chat"
        onClick={() => setOpen((c) => !c)}
        className="h-auto gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <MessageCircle aria-hidden="true" className="size-4" />
        {open ? "Close Assistant" : "Ask BreatheWise AI"}
      </Button>
    </div>
  );
}
