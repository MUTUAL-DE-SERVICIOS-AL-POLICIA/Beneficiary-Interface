"use server";
import { apiClient } from "@/utils/services";
import { ResponseData } from "@/utils/interfaces";

export const getDocuments = async (): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET("affiliates/documents");
    const { data } = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrido un error al obtener los documentos",
        data,
      };
    }

    return {
      error: false,
      message: "Documentos obtenidos exitosamente",
      data,
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener los todos los documentos.",
      documents: [],
    };
  }
};

export const createUpdateDocument = async (
  affiliateId: string,
  procedureId: number,
  body: any,
): Promise<ResponseData> => {
  try {
    const response = await apiClient.POST(
      `affiliates/${affiliateId}/document/${procedureId}/createOrUpdate`,
      body,
      true,
    );

    if (!response.ok) {
      return {
        error: true,
        message: "Error al crear o actualizar un documento",
      };
    }

    return {
      error: false,
      message: "Documento creado o actualizado correctamente",
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al crear o actualizar el documento",
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

export const getViewDocument = async (affiliateId: string, documentId: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`affiliates/${affiliateId}/documents/${documentId}`);
    const data = await response.blob();

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrido un error al obtener el expediente",
        data: response.statusText,
      };
    }

    return {
      error: false,
      message: "Expediente obtenido exitosamente",
      data,
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener el expediente",
      data: e.message,
    };
  }
};
