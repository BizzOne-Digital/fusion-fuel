'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { X } from 'lucide-react';
import { getLocalized } from '@/lib/utils';
import type { AnnouncementBar } from '@/types';
import type { Locale } from '@/types';

interface AnnouncementBarProps {
  announcement: AnnouncementBar;
  locale: Locale;
}

export function AnnouncementBarComponent({ announcement, locale }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!announcement.enabled) return;
    setDismissed(sessionStorage.getItem('ffb_announcement_dismissed') === '1');
  }, [announcement.enabled]);

  if (!announcement.enabled || dismissed) return null;

  const message = getLocalized(announcement.message, locale);
  if (!message) return null;

  const content = announcement.link ? (
    <Link href={announcement.link} className="underline underline-offset-2">
      {message}
    </Link>
  ) : (
    message
  );

  return (
    <div
      className="relative z-50 px-4 py-2 text-center text-sm font-medium"
      style={{
        backgroundColor: announcement.backgroundColor ?? '#E8F000',
        color: announcement.textColor ?? '#07090A',
      }}
      role="region"
      aria-label="Announcement"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 sm:gap-4">
        <p className="min-w-0 flex-1 break-words text-center">{content}</p>
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem('ffb_announcement_dismissed', '1');
            setDismissed(true);
          }}
          className="rounded p-1 hover:opacity-70"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
