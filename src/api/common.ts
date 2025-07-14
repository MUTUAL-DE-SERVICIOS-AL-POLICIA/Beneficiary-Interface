"use server";

import { apiClient } from "@/utils/services";
import { ResponseData } from "@/utils/interfaces";
export const postUploadChunk = async (body: any): Promise<ResponseData> => {
  try {
    const response = await apiClient.POST(`common/uploadChunk`, body, true);

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrido un error subir el chunk: " + body.numberChunk + " del archivo",
        data: response.statusText,
      };
    }

    return {
      error: false,
      message: "Chunk del archivo creado o actualizado correctamente",
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al crear o actualizar el archivo",
    };
  }
};
