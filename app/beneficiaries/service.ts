'use server';
import { apiClient } from '@/services';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const getBeneficiaries = async (
  limit: number = 10,
  page: number = 1,
  filter?: string,
): Promise<any> => {
  try {
    const beneficiaries = await apiClient.GET('api/persons', {
      limit,
      page,
      ...(filter ? { filter } : {}),
    });
    const data = await beneficiaries.json()
    return data;
  } catch (e: any) {
    throw e;
  }
};
