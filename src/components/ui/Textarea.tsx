import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-carbon">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'min-h-[120px] w-full rounded-xl border border-grey/30 bg-white px-4 py-3 text-carbon placeholder:text-grey/70 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/30',
          error && 'border-coral',
          className
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="text-sm text-coral">{error}</p>}
    </div>
  );
}
