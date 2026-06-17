import 'dotenv/config';

import mongoose from 'mongoose';
import { connectDB } from '../api/_lib/config/db';
import { User } from '../api/_lib/models/User';

/**
 * Non-destructive: ensures the admin user exists with the configured password.
 * Creates it if missing, otherwise resets ONLY its password. Touches nothing else.
 */
async function ensureAdmin() {
  await connectDB();

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@ainest.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({ name: 'Admin', email: adminEmail, password: adminPassword, role: 'admin' });
    console.log(`✓ Admin user CREATED: ${adminEmail}`);
  } else {
    existing.role = 'admin';
    existing.password = adminPassword; // pre-save hook re-hashes
    await existing.save();
    console.log(`✓ Admin already existed — password reset & role ensured: ${adminEmail}`);
  }

  await mongoose.disconnect();
  console.log('Done. Login should now work with ADMIN_EMAIL / ADMIN_PASSWORD from .env');
  process.exit(0);
}

ensureAdmin().catch((err) => { console.error('ensureAdmin failed:', err); process.exit(1); });
