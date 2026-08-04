"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-4 text-left font-medium text-ink hover:text-primary transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          size={18}
          className={cn(
            "transition-transform duration-200 flex-shrink-0",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          open ? "max-h-[500px] pb-4" : "max-h-0"
        )}
      >
        <div className="text-muted leading-relaxed text-sm">{children}</div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: { title: string; content: ReactNode; defaultOpen?: boolean }[];
}

export function Accordion({ items }: AccordionProps) {
  return (
    <div className="divide-y divide-border border-t border-border">
      {items.map((item, i) => (
        <AccordionItem key={i} title={item.title} defaultOpen={item.defaultOpen}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}