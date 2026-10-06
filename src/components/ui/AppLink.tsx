import { Link } from '@/i18n/navigation';
import { parseAppLinkHref } from '@/lib/footer-links';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type AppLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

export function AppLink({ href, className, ...props }: AppLinkProps) {
  return <Link href={parseAppLinkHref(href)} className={cn(className)} {...props} />;
}
