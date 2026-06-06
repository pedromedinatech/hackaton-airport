import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Branded gradient hero used in place of remote photos so the UI stays fast,
 * consistent and fully offline. The emoji is decorative; cards carry the text.
 */
export function CardImage({
  gradient,
  emoji,
  className,
  emojiClassName = "text-5xl",
  children,
}: {
  gradient: [string, string];
  emoji: string;
  className?: string;
  emojiClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
      style={{
        backgroundImage: `radial-gradient(120% 120% at 80% 0%, ${gradient[1]} 0%, ${gradient[0]} 70%)`,
      }}
    >
      <span className={cn("drop-shadow-lg", emojiClassName)} aria-hidden>
        {emoji}
      </span>
      {children}
    </div>
  );
}
