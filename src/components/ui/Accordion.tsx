'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn('divide-y divide-grey/20 rounded-2xl border border-grey/20', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span className="font-semibold text-carbon">{item.title}</span>
              <ChevronDown className={cn('h-5 w-5 shrink-0 transition', isOpen && 'rotate-180')} />
            </button>
            {isOpen && <div className="px-5 pb-4 text-grey">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
