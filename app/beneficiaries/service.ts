'use server';
import { apiClient } from '@/services';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const getCookies = async () => {
  console.log('getCookies');

  const cookieStore = cookies();
  const cookie = cookieStore.get('Set-Cookie');

  return cookie;
};

export const getBeneficiaries = async (
  limit: number = 10,
  page: number = 1,
  filter?: string,
): Promise<any> => {
  const host = process.env.NEXT_PUBLIC_SERVER_FRONTEND;
  const port = process.env.LOGIN_FRONTEND_PORT;
  try {
    const cookie = await getCookies();
    console.log(cookie);
    if (cookie == undefined) {
      console.log('Sin cookie');
      redirect(`http://${host}:${port}/`);
    }
    const beneficiaries = await apiClient.GET('api/persons', {
      limit,
      page,
      ...(filter ? { filter } : {}),
    });
    return beneficiaries;
  } catch (e: any) {
    throw e;
  }
};
