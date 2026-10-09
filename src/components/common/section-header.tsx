import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <p className="type-eyebrow text-muted-foreground">{eyebrow}</p>
        )}
        <h2 id={id} className="type-h2 text-balance">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group/link inline-flex shrink-0 items-center gap-1.5 pb-1 text-sm font-medium underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground"
        >
          {linkLabel}
          <ArrowRight
            className="size-4 transition-transform group-hover/link:translate-x-0.5"
            aria-hidden
          />
        </Link>
      )}
    </div>
  );
}
