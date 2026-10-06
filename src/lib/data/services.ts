import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { serializeForClient } from '@/lib/utils';
import type { IService } from '@/models/Service';

export async function getPublishedServices(): Promise<IService[]> {
  try {
    await connectDB();
    return serializeForClient(await Service.find({ status: 'published' }).sort({ order: 1 }).lean<IService[]>());
  } catch {
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<IService | null> {
  try {
    await connectDB();
    const service = await Service.findOne({ slug, status: 'published' }).lean<IService>();
    return service ? serializeForClient(service) : null;
  } catch {
    return null;
  }
}
