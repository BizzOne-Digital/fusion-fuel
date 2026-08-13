'use client';

interface FormFieldProps {
  label: string;
  name?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({
  label,
  name,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function inputClassName(error?: boolean) {
  return `w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-orange-500/30 ${
    error ? 'border-red-300 bg-red-50' : 'border-zinc-300 bg-white focus:border-orange-500'
  }`;
}

export function textareaClassName(error?: boolean) {
  return `${inputClassName(error)} min-h-[100px] resize-y`;
}

export function selectClassName(error?: boolean) {
  return inputClassName(error);
}
