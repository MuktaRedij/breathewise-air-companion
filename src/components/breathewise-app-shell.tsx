import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Bot, Leaf, Loader2, MapPin, MessageCircle, Send, Sparkles, X } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AirQualityProvider, useAirQuality } from "@/contexts/air-quality-context";
import { AiService } from "@/services/ai.service";
import type { ChatMessage } from "@/types/ai.types";

export function BreatheWiseAppShell({ children }: { children: React.ReactNode }) {
  return (
    <AirQualityProvider>
      <AppShellContent>{children}</AppShellContent>
    </AirQualityProvider>
  );
}

function AppShellContent({ children }: { children: React.ReactNode }) {
  const { currentAirData, standard } = useAirQuality();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <BrandMark />
          <div className="flex items-center gap-3">
            <span
              className={`hidden items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold sm:inline-flex ${
                currentAirData.isLive ? "bg-good/15 text-good" : "bg-warning/15 text-warning"
              }`}
            >
              <span
                className={`size-2 rounded-full ${
                  currentAirData.isLive ? "bg-good animate-pulse" : "bg-warning"
                }`}
              />
              {currentAirData.isLive ? "LIVE DATA" : "REFERENCE BASELINE"}
            </span>

            <span className="hidden items-center gap-1 text-xs text-muted-foreground md:inline-flex">
              <MapPin aria-hidden="true" className="size-3.5 text-primary" />
              {currentAirData.city} · AQI {currentAirData.aqi} (
              {standard === "INDIA_CPCB" ? "CPCB" : "EPA"})
            </span>
          </div>
        </div>
        <nav
          aria-label="BreatheWise sections"
          className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 pb-2 sm:px-5"
        >
          <Link
            to="/dashboard"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-secondary text-secondary-foreground" }}
            className="inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Leaf aria-hidden="true" className="size-4" /> Air quality
          </Link>
          <Link
            to="/planner"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-secondary text-secondary-foreground" }}
            className="inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Daily planner
          </Link>
          <Link
            to="/indoor-air"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-secondary text-secondary-foreground" }}
            className="inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Indoor air
          </Link>
          <Link
            to="/travel"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-secondary text-secondary-foreground" }}
            className="inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Green travel
          </Link>
          <Link
            to="/impact"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-secondary text-secondary-foreground" }}
            className="inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            My impact
          </Link>
          <Link
            to="/community"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-secondary text-secondary-foreground" }}
            className="inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Community
          </Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">{children}</main>
      <footer className="border-t border-border bg-muted/35 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>BreatheWise · Breathe better. Live smarter. Build cleaner communities.</span>
          <span>Standards: Indian CPCB NAQI &amp; US EPA AQI. Data persistence enabled.</span>
        </div>
      </footer>
      <ChatAssistant />
    </div>
  );
}

function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { currentAirData, profile } = useAirQuality();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `Hello! I am your BreatheWise Environmental Health Assistant. I am actively tuned to **${currentAirData.city}** (Current AQI: **${currentAirData.aqi} - ${currentAirData.category}**). Ask me about outdoor exercise, window ventilation, mask guidance, or low-emission commuting!`,
      timestamp: "Now",
    },
  ]);

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
          text: "I encountered a temporary communication glitch. Please check your network or try asking your question again.",
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
    "How can I protect my family from PM2.5?",
    "What is the best time to open my windows?",
    "How can I reduce pollution exposure during my commute?",
    "What are the best low-emission travel alternatives?",
    "What should I do when AQI becomes hazardous?",
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open ? (
        <section
          id="breathewise-chat"
          aria-label="BreatheWise AI Health Assistant"
          className="flex h-[min(540px,calc(100svh-6rem))] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  BreatheWise Assistant
                  <Sparkles className="size-3 text-amber-500 fill-amber-500" />
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-2.5" />
                  {currentAirData.city} (AQI {currentAirData.aqi} · {currentAirData.category})
                </p>
              </div>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
            >
              <X aria-hidden="true" className="size-4" />
            </Button>
          </div>

          {/* Messages list */}
          <div
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            className="flex-1 space-y-3.5 overflow-y-auto p-4 text-sm"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/80 text-foreground border border-border/50"
                  }`}
                >
                  <div className="whitespace-pre-line prose-sm">{m.text}</div>
                </div>
                <span className="mt-1 px-1 text-[10px] text-muted-foreground">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5 w-fit">
                <Loader2 className="size-3.5 animate-spin text-primary" />
                Analyzing air conditions for {currentAirData.city}...
              </div>
            )}

            {/* Quick Prompts */}
            <div className="pt-2">
              <p className="text-[11px] font-medium text-muted-foreground mb-1.5">Ask questions:</p>
              <div className="flex flex-col gap-1.5">
                {quickPrompts.slice(0, 3).map((prompt) => (
                  <Button
                    key={prompt}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-auto text-left justify-start text-xs py-1.5 px-2.5 border-dashed whitespace-normal"
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border p-3 bg-card"
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Ask about ${currentAirData.city}'s air...`}
              aria-label="Message BreatheWise AI"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send message"
              disabled={!draft.trim() || isTyping}
            >
              <Send aria-hidden="true" className="size-4" />
            </Button>
          </form>

          <p className="border-t border-border bg-muted/20 px-3 py-1.5 text-center text-[10px] text-muted-foreground">
            Context-Aware AI · Scientific Health Defense &amp; Emission Insights
          </p>
        </section>
      ) : null}

      <Button
        type="button"
        aria-expanded={open}
        aria-controls="breathewise-chat"
        onClick={() => setOpen((c) => !c)}
        className="rounded-full shadow-xl gap-2 px-4 py-2.5 h-auto text-sm font-medium"
      >
        <MessageCircle aria-hidden="true" className="size-4" />
        {open ? "Close Assistant" : "Ask BreatheWise AI"}
      </Button>
    </div>
  );
}
