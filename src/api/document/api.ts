"use server";
import { apiClient } from "@/services";
import { ResponseData } from "@/types";

export const getAllDocuments = async (): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET("procedure-documents");
    const { status } = response;
    const responseData = await response.json();

    // No necesita Dto ni transformar datos
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
  affiliateId: number,
  fileId: number,
  body: any,
): Promise<ResponseData> => {
  try {
    const response = await apiClient.POST(
      `affiliates/${affiliateId}/document/${fileId}/createOrUpdate`,
      body,
      true,
    );
    const { status } = response;

    if (status >= 400) {
      return {
        error: true,
        message: "Error al crear o actualizar un documento",
      };
    }
    if (status == 200 || status == 201) {
      return {
        error: false,
        message: "Documento creado o actualizado correctamente",
      };
    }

    return {
      error: true,
      message: "Ocurrio un error",
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al crear o actualizar el documento",
    };
  }
};
