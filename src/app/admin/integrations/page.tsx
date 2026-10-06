'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminHeader from '@/components/admin/AdminHeader';
import FormField, { selectClassName } from '@/components/admin/FormField';
import { adminFetch } from '@/lib/admin/client';

export default function AdminIntegrationsPage() {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [logs, setLogs] = useState<Array<Record<string, unknown>>>([]);
  const [eventType, setEventType] = useState('contact.created');
  const [testing, setTesting] = useState(false);

  async function load() {
    const { data } = await adminFetch<{ config: Record<string, unknown>; logs: Array<Record<string, unknown>> }>(
      '/api/admin/integrations'
    );
    setConfig(data?.config ?? null);
    setLogs(data?.logs ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleTest(e: React.FormEvent) {
    e.preventDefault();
    setTesting(true);
    const { data, error } = await adminFetch<{ result: { success: boolean; error?: string } }>(
      '/api/admin/integrations',
      { method: 'POST', body: JSON.stringify({ eventType }) }
    );
    setTesting(false);
    if (error) toast.error(error);
    else if (data?.result.success) toast.success('Webhook test succeeded');
    else toast.error(data?.result.error ?? 'Webhook test failed');
    void load();
  }

  return (
    <div>
      <AdminHeader title="Integrations" description="CRM webhook configuration and connection logs." />
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 font-semibold">CRM Webhook</h2>
        {config && (
          <dl className="space-y-2 text-sm">
            <div className="flex gap-2"><dt className="text-zinc-500 w-32">Provider</dt><dd>{config.provider as string}</dd></div>
            <div className="flex gap-2"><dt className="text-zinc-500 w-32">Webhook URL</dt><dd>{(config.webhookUrl as string) || 'Not configured'}</dd></div>
            <div className="flex gap-2"><dt className="text-zinc-500 w-32">Status</dt><dd>{config.enabled ? 'Enabled' : 'Disabled'}</dd></div>
          </dl>
        )}
        <p className="mt-4 text-xs text-zinc-500">Configure via CRM_PROVIDER, CRM_WEBHOOK_URL, and CRM_WEBHOOK_SECRET environment variables.</p>
      </div>

      <form onSubmit={handleTest} className="mb-8 max-w-md space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="font-semibold">Test Connection</h2>
        <FormField label="Event Type">
          <select className={selectClassName()} value={eventType} onChange={(e) => setEventType(e.target.value)}>
            <option value="contact.created">contact.created</option>
            <option value="customer.created">customer.created</option>
            <option value="order.paid">order.paid</option>
            <option value="booking.created">booking.created</option>
          </select>
        </FormField>
        <button type="submit" disabled={testing} className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white disabled:opacity-50">
          {testing ? 'Testing…' : 'Send Test Event'}
        </button>
      </form>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 font-semibold">Recent Logs</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-zinc-500">No webhook logs yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {logs.map((log) => (
              <li key={log.id as string} className="rounded border px-3 py-2">
                <span className="text-zinc-500">{new Date(log.createdAt as string).toLocaleString()}</span>
                {' — '}
                <span>{(log.metadata as { success?: boolean })?.success ? 'Success' : 'Failed'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
