'use server';
import { apiClient } from '@/services';

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
    const statusCode = beneficiaries.status
    const responseData = await beneficiaries.json()
    if(statusCode >= 400) {
      return {
        error: true,
        message: responseData.message
      }
    }
    if(statusCode == 200) {
      return {
        error: false,
        message: "Get persons successful",
        data: responseData
      }
    }
  } catch (e: any) {
    console.error(e)
    return {
      error: true,
      message: "Error al obtener el listado de personas"
    }
  }
};
