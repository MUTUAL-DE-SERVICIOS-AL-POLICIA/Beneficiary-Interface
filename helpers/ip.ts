'use server';
import { headers } from 'next/headers';

export const checkIp = async () => {
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for");
  if (ip?.startsWith('::ffff:')) {
    return ip.replace('::ffff:', '');
  }
  console.log(ip);
  if (ip) return ip;
};
