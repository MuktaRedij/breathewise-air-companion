import { Fragment } from "react";

/**
 * Lightweight, XSS-safe markdown renderer for AI chat responses.
 * Supports headings (###), bold (**text**), italic (*text*), and bullet lists (- item / 1. item).
 */
export function MarkdownText({ content }: { content: string }) {
  const lines = content.split("\n");

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return (
          <em key={i} className="italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      return <Fragment key={i}>{part}</Fragment>;
    });
  };

  return (
    <div className="space-y-1.5 text-[13px] leading-relaxed">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) return <div key={idx} className="h-1" />;

        if (line.startsWith("### ")) {
          return (
            <h4 key={idx} className="font-display pt-1 text-sm font-semibold text-foreground">
              {renderInline(line.slice(4))}
            </h4>
          );
        }

        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{renderInline(line.slice(2))}</span>
            </div>
          );
        }

        const numberedMatch = line.match(/^(\d+\.)\s+(.*)$/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="shrink-0 font-semibold text-primary">{numberedMatch[1] ?? ""}</span>
              <span>{renderInline(numberedMatch[2] ?? "")}</span>
            </div>
          );
        }

        return <p key={idx}>{renderInline(line)}</p>;
      })}
    </div>
  );
}
