"use server";

import { webActionError } from "@/utils/helpers/server-action-error";

import { apiClient } from "@/utils/services";
import { ResponseData } from "@/utils/interfaces";

export const getAffiliate = async (affiliateId: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`beneficiaries/affiliates/${affiliateId}`);
    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: data.message,
        data: response.statusText,
      };
    }

    return {
      error: false,
      message: "Datos del afiliado obtenido exitosamente",
      data,
    };
  } catch (e: any) {
    const webError = webActionError(e);

    if (webError) return webError;

    return {
      error: true,
      message: "Error al obtener datos del afiliado",
    };
  }
};
