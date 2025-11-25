"use server";
import { apiClient } from "@/utils/services";
import { ResponseData } from "@/utils/interfaces";

export const getDocuments = async (affiliateId: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`beneficiaries/affiliates/createDocument/${affiliateId}`);
    const { data } = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrió un error al obtener los datos necesarios para crear documentos",
        data,
      };
    }

    return {
      error: false,
      message: "Datos para creación de documentos obtenidos exitosamente",
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

export const createAffiliateDocument = async (
  affiliateId: string,
  procedureId: number,
  body: any,
): Promise<ResponseData> => {
  try {
    const response = await apiClient.POST(
      `beneficiaries/affiliates/${affiliateId}/document/${procedureId}`,
      body,
      true,
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: "Error al crear el documento",
      };
    }

    return {
      error: data.error,
      message: data.message,
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al crear el documento",
    };
  }
};

export const updateAffiliateDocument = async (
  affiliateId: string,
  procedureId: number,
  body: any,
): Promise<ResponseData> => {
  try {
    const response = await apiClient.PATCH(
      `beneficiaries/affiliates/${affiliateId}/document/${procedureId}`,
      body,
      true,
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: "Error al actualizar el documento",
      };
    }

    return {
      error: data.error,
      message: data.message,
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al actualizar el documento",
    };
  }
};

export const getAffiliateDocuments = async (affiliateId: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`beneficiaries/affiliates/${affiliateId}/documents`);
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
    const response = await apiClient.GET(`beneficiaries/affiliates/${affiliateId}/documents/${documentId}`);
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

export const deleteDocument = async (
  affiliateId: string,
  procedureDocumentId: string,
): Promise<ResponseData> => {
  try {
    const response = await apiClient.DELETE(
      `beneficiaries/affiliates/${affiliateId}/documents/${procedureDocumentId}`,
    );
    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrido un error al eliminar el expediente",
        data: response.statusText,
      };
    }

    return {
      error: data.error,
      message: data.message,
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al crear o actualizar el expediente",
    };
  }
};
