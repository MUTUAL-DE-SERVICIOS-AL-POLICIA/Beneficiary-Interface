"use server";

import { apiClient } from "@/utils/services";
import { ResponseData } from "@/utils/interfaces";

export const getAffiliate = async (affiliateId: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`affiliates/${affiliateId}`);
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
    console.error(e);

    return {
      error: true,
      message: "Error al obtener datos del afiliado",
    };
  }
};

export const getAffiliateDocuments = async (affiliateId: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`affiliates/${affiliateId}/documents`);
    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrió un error",
        data: response.statusText,
      };
    }

    return {
      error: false,
      message: "Documentos del afiliado obtenido exitosamente",
      data,
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener los documentos del afiliado",
      statusDocuments: false,
      affiliateDocuments: [],
    };
  }
};
