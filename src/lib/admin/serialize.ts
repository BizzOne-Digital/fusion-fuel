export function serializeDoc<T extends { _id?: unknown; toObject?: () => Record<string, unknown> }>(
  doc: T | null
): Record<string, unknown> | null {
  if (!doc) {
    return null;
  }

  const obj = typeof doc.toObject === 'function' ? doc.toObject() : (doc as Record<string, unknown>);
  return {
    ...obj,
    id: String(obj._id),
    _id: undefined,
  };
}

export function serializeDocs<T extends { _id?: unknown; toObject?: () => Record<string, unknown> }>(
  docs: T[]
): Record<string, unknown>[] {
  return docs.map((doc) => serializeDoc(doc)!);
}
