import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import Customer from '@/models/Customer';
import { loginSchema } from '@/lib/validators/auth';
import { authConfig } from '@/lib/auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: 'admin-credentials',
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        await connectDB();

        const admin = await AdminUser.findOne({ email: parsed.data.email }).select('+passwordHash');
        if (!admin?.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
        if (!isValid) {
          return null;
        }

        await AdminUser.updateOne({ _id: admin._id }, { $set: { lastLogin: new Date() } });

        return {
          id: admin._id.toString(),
          email: admin.email,
          name: admin.name,
          role: 'admin' as const,
          adminRole: admin.role,
        };
      },
    }),
    Credentials({
      id: 'customer-credentials',
      name: 'Customer',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        await connectDB();

        const customer = await Customer.findOne({ email: parsed.data.email }).select('+passwordHash');
        if (!customer?.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(parsed.data.password, customer.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: customer._id.toString(),
          email: customer.email,
          name: customer.name,
          role: 'customer' as const,
          isEmailVerified: customer.emailVerified,
        };
      },
    }),
  ],
});
