import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Leaf, MessageCircle, Send, X } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = { id: string; role: "assistant" | "user"; text: string };

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "This preview uses sample readings and prepared guidance—not a live AI or air-quality service. What would you like to explore?",
  },
];

function previewReply(prompt: string): string {
  const text = prompt.toLowerCase();
  if (text.includes("jog") || text.includes("exercise") || text.includes("safe")) {
    return "I can’t assess today’s safety from this preview because its readings are demo data. Check a trusted local air-quality source and public-health guidance; follow your clinician’s advice for personal health questions.";
  }
  if (text.includes("pm2.5") || text.includes("family")) {
    return "For general planning, check current local readings, reduce indoor sources such as smoke, and follow appliance and filter instructions. This preview cannot measure your home or provide medical advice.";
  }
  if (text.includes("window") || text.includes("ventilat")) {
    return "Check a current, trusted outdoor reading before airing rooms. The sample shown here is not live and shouldn’t determine when you open windows.";
  }
  if (text.includes("commute") || text.includes("travel")) {
    return "Compare a route away from the busiest roads with a shared ride, walking, cycling, or transit option. The Travel page shows simplified emission estimates with their assumptions.";
  }
  if (text.includes("carbon") || text.includes("footprint")) {
    return "Try one trip by walking, cycling, transit, or carpooling when it suits your day. The Impact page can show an illustrative estimate; real savings vary by route and vehicle.";
  }
  return "I can offer general planning ideas, but this preview has no live readings or connected AI. Check official local air-quality information before making a health or outdoor-activity decision.";
}

export function BreatheWiseAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <BrandMark />
          <span className="hidden items-center gap-2 rounded-md bg-warning/10 px-2.5 py-1.5 text-xs font-semibold text-warning sm:inline-flex">
            <span className="size-2 rounded-full bg-warning" /> DEMO DATA
          </span>
        </div>
        <nav aria-label="BreatheWise sections" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 pb-2 sm:px-5">
          <Link to="/dashboard" activeOptions={{ exact: true }} activeProps={{ className: "bg-secondary text-secondary-foreground" }} className="inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Leaf aria-hidden="true" className="size-4" /> Air quality
          </Link>
          <Link to="/planner" activeOptions={{ exact: true }} activeProps={{ className: "bg-secondary text-secondary-foreground" }} className="inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Daily planner</Link>
          <Link to="/indoor-air" activeOptions={{ exact: true }} activeProps={{ className: "bg-secondary text-secondary-foreground" }} className="inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Indoor air</Link>
          <Link to="/travel" activeOptions={{ exact: true }} activeProps={{ className: "bg-secondary text-secondary-foreground" }} className="inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Green travel</Link>
          <Link to="/impact" activeOptions={{ exact: true }} activeProps={{ className: "bg-secondary text-secondary-foreground" }} className="inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">My impact</Link>
          <Link to="/community" activeOptions={{ exact: true }} activeProps={{ className: "bg-secondary text-secondary-foreground" }} className="inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Community</Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">{children}</main>
      <footer className="border-t border-border bg-muted/35 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>BreatheWise · Breathe better. Live smarter. Build cleaner communities.</span>
          <span>Preview readings and activity are demo-only and reset when the page is refreshed.</span>
        </div>
      </footer>
      <ChatPreview />
    </div>
  );
}

function ChatPreview() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const sendMessage = (value: string) => {
    const text = value.trim();
    if (!text) return;
    const id = Date.now().toString();
    setMessages((current) => [
      ...current,
      { id: `${id}-user`, role: "user", text },
      { id: `${id}-assistant`, role: "assistant", text: previewReply(text) },
    ]);
    setDraft("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open ? (
        <section id="breathewise-demo-chat" aria-label="BreatheWise assistant preview" className="flex h-[min(440px,calc(100svh-7rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-md border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2.5"><span className="flex size-8 items-center justify-center rounded-md bg-secondary text-primary"><Leaf aria-hidden="true" className="size-4" /></span><div><p className="text-sm font-semibold">BreatheWise</p><p className="text-xs text-muted-foreground">Assistant preview · demo replies</p></div></div>
            <Button type="button" size="icon" variant="ghost" aria-label="Close assistant" onClick={() => setOpen(false)}><X aria-hidden="true" /></Button>
          </div>
          <div role="log" aria-live="polite" aria-label="Conversation" className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <p key={message.id} className={`max-w-[92%] rounded-md px-3 py-2.5 text-sm leading-relaxed ${message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{message.text}</p>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              {["When should I open windows?", "How can I reduce commute exposure?"].map((prompt) => (
                <Button key={prompt} type="button" size="sm" variant="outline" className="h-auto whitespace-normal text-left" onClick={() => sendMessage(prompt)}>{prompt}</Button>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask a general question" aria-label="Message BreatheWise" />
            <Button type="submit" size="icon" aria-label="Send message" disabled={!draft.trim()}><Send aria-hidden="true" /></Button>
          </form>
          <p className="border-t border-border px-3 py-2 text-center text-[11px] text-muted-foreground">Not live AI · Messages stay in this tab only.</p>
        </section>
      ) : null}
      <Button type="button" aria-expanded={open} aria-controls="breathewise-demo-chat" onClick={() => setOpen((current) => !current)} className="rounded-md shadow-lg">
        <MessageCircle aria-hidden="true" /> {open ? "Close assistant" : "Ask BreatheWise"}
      </Button>
    </div>
  );
}