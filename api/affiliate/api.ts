"use server";
import { apiClient } from "@/services";
import { ResponseData } from "@/types";
import { transformToAffiliate } from "./transform";
import { createEmptyObject } from "@/helpers/utils";
import { Affiliate, AffiliateState, Category, Degree, Unit } from "@/domain";

export const getAffiliate = async (affiliateId: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`affiliates/${affiliateId}`);
    const { status }: { status: number } = response;
    const responseData = await response.json();
    if (status == 200) {
      const { affiliateData, affiliateState, degree, unit, category } = transformToAffiliate(responseData);
      return {
        error: false,
        message: "Datos del afiliado obtenido exitosamente",
        affiliateData,
        affiliateState,
        degree,
        unit,
        category,
      };
    }
    if (status >= 400) {
      const { message } = responseData;
      return {
        error: true,
        message: message,
        affiliateData: createEmptyObject<Affiliate>(),
        affiliateState: createEmptyObject<AffiliateState>(),
        degree: createEmptyObject<Degree>(),
        unit: createEmptyObject<Unit>(),
        category: createEmptyObject<Category>(),
      };
    }
    return {
      error: true,
      message: "Ocurrio un error",
      affiliateData: createEmptyObject<Affiliate>(),
      affiliateState: createEmptyObject<AffiliateState>(),
      degree: createEmptyObject<Degree>(),
      unit: createEmptyObject<Unit>(),
      category: createEmptyObject<Category>(),
    };
  } catch (e: any) {
    console.error(e);
    return {
      error: true,
      message: "Error al obtener datos del afiliado",
      affiliateData: createEmptyObject<Affiliate>(),
      affiliateState: createEmptyObject<AffiliateState>(),
      degree: createEmptyObject<Degree>(),
      unit: createEmptyObject<Unit>(),
      category: createEmptyObject<Category>(),
    };
  }
};

export const getAffiliateDocuments = async (affiliateId: number): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`affiliates/${affiliateId}/documents`);
    const { status } = response;
    const responseData = await response.json();
    if (status == 200) {
      const { status: statusDocuments, documentsAffiliate } = responseData;
      return {
        error: false,
        message: "Documentos del afiliado obtenido exitosamente",
        statusDocuments,
        affiliateDocuments: documentsAffiliate,
      };
    }
    if (status >= 400) {
      const { message } = responseData;
      return {
        error: true,
        message: message,
        statusDocuments: false,
        affiliateDocuments: [],
      };
    }
    return {
      error: true,
      message: "Ocurrio un error",
      statusDocuments: false,
      affiliateDocuments: [],
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
