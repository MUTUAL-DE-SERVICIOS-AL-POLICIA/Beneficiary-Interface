'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const host = process.env.NEXT_PUBLIC_SERVER_FRONTEND;
const port = process.env.LOGIN_FRONTEND_PORT;

export const checkCookie = async () => {
  const cookie = await getCookie('Set-Cookie');
  if (cookie == undefined) {
    console.log('Sin cookie');
    // redirect(`http://${host}:${port}/`);
  }
  if (cookie) return cookie;
};

const getCookie = async (name: string) => {
  return cookies().get(name)?.value ?? undefined;
};
