"use server";

import { apiClient } from "@/utils/services";
import { ResponseData } from "@/utils/interfaces";

export const getAffiliateShowFileDossiers = async (affiliateId: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`beneficiaries/affiliates/${affiliateId}/showFileDossiers`);
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

export const getAllFileDossiers = async (affiliateId: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`beneficiaries/affiliates/createFileDossier/${affiliateId}`);
    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: `Ocurrió un error al obtener los expedientes del afiliado`,
        data: [],
      };
    }

    return {
      error: data.error,
      message: data.message,
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

export const createFileDossier = async (
  affiliateId: string,
  fileDossierId: string,
  initialName: string,
  totalChunks: number,
): Promise<ResponseData> => {
  try {
    const response = await apiClient.POST(
      `beneficiaries/affiliates/${affiliateId}/fileDossier/${fileDossierId}`,
      {
        initialName,
        totalChunks,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrió un error al crear el expediente",
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
      message: "Error al crear el expediente",
      data: e.message,
    };
  }
};

export const updateFileDossier = async (
  affiliateId: string,
  fileDossierId: string,
  initialName: string,
  totalChunks: number,
): Promise<ResponseData> => {
  try {
    const response = await apiClient.PATCH(
      `beneficiaries/affiliates/${affiliateId}/fileDossier/${fileDossierId}`,
      {
        initialName,
        totalChunks,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrió un error al crear o actualizar el expediente",
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
      data: e.message,
    };
  }
};

export const deleteFileDossier = async (
  affiliateId: string,
  fileDossierId: string,
): Promise<ResponseData> => {
  try {
    const response = await apiClient.DELETE(
      `beneficiaries/affiliates/${affiliateId}/fileDossiers/${fileDossierId}`,
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
    const response = await apiClient.GET(
      `beneficiaries/affiliates/${affiliateId}/fileDossiers/${fileDossierId}`,
    );
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
