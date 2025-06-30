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

export const getAffiliateFileDossiers = async (): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`affiliates/fileDossiers`);
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
      message: "Tipos de expedientes obtenido exitosamente",
      data,
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener los tipos expedientes del afiliado",
      statusDocuments: false,
      affiliateDocuments: [],
    };
  }
};

export const getAffiliateShowFileDossiers = async (affiliateId: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`affiliates/${affiliateId}/showFileDossiers`);
    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrió un error al obtener los expedientes del afiliado",
        data: response.statusText,
      };
    }

    return {
      error: false,
      message: "Expedientes del afiliado obtenido exitosamente",
      data,
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener los expedientes del afiliado",
      statusDocuments: false,
      affiliateDocuments: [],
    };
  }
};

export const getAllFileDossiers = async (): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`affiliates/fileDossiers`);
    const data = await response.json();

    if (!response.ok || !data.serviceStatus) {
      return {
        error: true,
        message: `Ocurrió un error al obtener los expedientes del afiliado, service: ${data.serviceStatus}`,
        data: [],
      };
    }

    return {
      error: false,
      message: "Expedientes obtenidos exitosamente",
      data: data.data,
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener los todos los expedientes.",
      data: [],
    };
  }
};

export const postCreateUpdateFileDossier = async (
  affiliateId: string,
  fileDossierId: string,
  body: any,
): Promise<ResponseData> => {
  try {
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
    const totalChunks = Math.ceil(body.size / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(body.size, start + CHUNK_SIZE);
      const chunk = body.slice(start, end);

      const chunkForm = new FormData();

      chunkForm.append("chunk", chunk);

      const response = await apiClient.POST(
        `affiliates/${affiliateId}/fileDossier/${fileDossierId}/uploadChunk/${i}`,
        chunkForm,
        true,
      );

      if (!response.ok) {
        throw new Error("Error al subir chunk " + i);
      }
    }
    const response = await apiClient.POST(
      `affiliates/${affiliateId}/fileDossier/${fileDossierId}/concatChunksAndUploadFile/${totalChunks}`,
      {},
    );

    if (!response.ok) {
      return {
        error: true,
        message: "Error al crear o actualizar expediente",
      };
    }

    return {
      error: false,
      message: "Expediente creado o actualizado correctamente",
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al crear o actualizar el expediente",
    };
  }
};

export const getViewFileDossier = async (
  affiliateId: string,
  fileDossierId: string,
): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`affiliates/${affiliateId}/fileDossiers/${fileDossierId}`);
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
