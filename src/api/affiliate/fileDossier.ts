"use server";

import { apiClient } from "@/utils/services";
import { ResponseData } from "@/utils/interfaces";
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
  initialName: string,
  totalChunks: number,
): Promise<ResponseData> => {
  try {
    const response = await apiClient.POST(
      `affiliates/${affiliateId}/fileDossier/${fileDossierId}/createOrUpdateFileDossier`,
      {
        initialName,
        totalChunks,
      },
    );

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrió un error al crear o actualizar el expediente",
        data: response.statusText,
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
      data: e.message,
    };
  }
};

export const deleteFileDossier = async (
  affiliateId: string,
  fileDossierId: string,
): Promise<ResponseData> => {
  try {
    const response = await apiClient.DELETE(`affiliates/${affiliateId}/fileDossiers/${fileDossierId}`);
    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrido un error al eliminar el expediente",
        data: response.statusText,
      };
    }

    return {
      error: false,
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
