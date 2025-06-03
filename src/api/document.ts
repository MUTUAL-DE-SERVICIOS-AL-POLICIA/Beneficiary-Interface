"use server";
import { apiClient } from "@/utils/services";
import { ResponseData } from "@/utils/interfaces";

export const getAllDocuments = async (): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET("procedure-documents");
    const { status } = response;
    const responseData = await response.json();

    if (status == 200) {
      return {
        error: false,
        message: "Documentos obtenidos exitosamente",
        documents: responseData,
      };
    }
    if (status >= 400) {
      const { message } = responseData;

      return {
        error: true,
        message: message,
        documents: [],
      };
    }

    return {
      error: true,
      message: "Ocurrio un error",
      documents: [],
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
  fileId: number,
  body: any,
): Promise<ResponseData> => {
  try {
    const response = await apiClient.POST(
      `affiliates/${affiliateId}/document/${fileId}/createOrUpdate`,
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
