import { createHmac, randomUUID } from 'crypto';

export type CRMEventType =
  | 'customer.created'
  | 'order.paid'
  | 'order.status_changed'
  | 'booking.created'
  | 'contact.created';

export interface CRMEventPayload {
  eventId: string;
  eventType: CRMEventType;
  occurredAt: string;
  data: Record<string, unknown>;
}

export interface CRMProviderResult {
  success: boolean;
  provider: string;
  eventId: string;
  error?: string;
}

export interface CRMProvider {
  readonly name: string;
  isEnabled(): boolean;
  sendEvent(event: CRMEventPayload): Promise<CRMProviderResult>;
}

export class NoOpCRMProvider implements CRMProvider {
  readonly name = 'none';

  isEnabled(): boolean {
    return false;
  }

  async sendEvent(event: CRMEventPayload): Promise<CRMProviderResult> {
    return {
      success: true,
      provider: this.name,
      eventId: event.eventId,
    };
  }
}

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export class WebhookCRMProvider implements CRMProvider {
  readonly name = 'webhook';
  private readonly url: string;
  private readonly secret: string;

  constructor(url: string, secret: string) {
    this.url = url;
    this.secret = secret;
  }

  isEnabled(): boolean {
    return Boolean(this.url && this.secret);
  }

  async sendEvent(event: CRMEventPayload): Promise<CRMProviderResult> {
    if (!this.isEnabled()) {
      return {
        success: false,
        provider: this.name,
        eventId: event.eventId,
        error: 'Webhook CRM provider is not configured',
      };
    }

    const body = JSON.stringify(event);
    const signature = signPayload(body, this.secret);

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CRM-Event-Id': event.eventId,
          'X-CRM-Event-Type': event.eventType,
          'X-CRM-Signature': signature,
        },
        body,
      });

      if (!response.ok) {
        return {
          success: false,
          provider: this.name,
          eventId: event.eventId,
          error: `Webhook responded with status ${response.status}`,
        };
      }

      return {
        success: true,
        provider: this.name,
        eventId: event.eventId,
      };
    } catch (error) {
      return {
        success: false,
        provider: this.name,
        eventId: event.eventId,
        error: error instanceof Error ? error.message : 'Unknown CRM webhook error',
      };
    }
  }
}

export function createCRMEvent(
  eventType: CRMEventType,
  data: Record<string, unknown>,
  eventId = randomUUID()
): CRMEventPayload {
  return {
    eventId,
    eventType,
    occurredAt: new Date().toISOString(),
    data,
  };
}

export function getCRMProvider(): CRMProvider {
  const provider = (process.env.CRM_PROVIDER ?? 'none').toLowerCase();

  if (provider === 'webhook') {
    return new WebhookCRMProvider(
      process.env.CRM_WEBHOOK_URL ?? '',
      process.env.CRM_WEBHOOK_SECRET ?? ''
    );
  }

  return new NoOpCRMProvider();
}

export async function dispatchCRMEvent(
  eventType: CRMEventType,
  data: Record<string, unknown>
): Promise<CRMProviderResult> {
  const provider = getCRMProvider();
  const event = createCRMEvent(eventType, data);

  if (!provider.isEnabled()) {
    return provider.sendEvent(event);
  }

  return provider.sendEvent(event);
}

export function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) {
    return false;
  }

  const expected = signPayload(payload, secret);
  return expected === signature;
}
