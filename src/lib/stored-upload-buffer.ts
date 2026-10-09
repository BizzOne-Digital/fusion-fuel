import 'server-only';

/** Normalize MongoDB / Mongoose binary fields to a Node Buffer for HTTP responses. */
export function bufferFromStoredUploadData(data: unknown): Buffer | null {
  if (data == null) {
    return null;
  }
  if (Buffer.isBuffer(data)) {
    return data;
  }
  if (data instanceof Uint8Array) {
    return Buffer.from(data);
  }
  if (data instanceof ArrayBuffer) {
    return Buffer.from(data);
  }
  if (typeof data === 'object' && data !== null) {
    const record = data as Record<string, unknown>;
    if (record._bsontype === 'Binary' && record.buffer instanceof Uint8Array) {
      return Buffer.from(record.buffer);
    }
    if (record.type === 'Buffer' && Array.isArray(record.data)) {
      return Buffer.from(record.data as number[]);
    }
    if (typeof record.value === 'function') {
      try {
        const bytes = (record.value as (asBuffer: boolean) => Uint8Array)(true);
        if (bytes instanceof Uint8Array) {
          return Buffer.from(bytes);
        }
      } catch {
        // ignore
      }
    }
  }
  return null;
}
