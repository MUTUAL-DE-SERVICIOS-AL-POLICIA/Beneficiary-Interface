"use server";

import { webActionError } from "@/utils/auth/server-action-error";

import { apiClient } from "@/utils/services/GatewayServerClient";
import { ResponseData } from "@/utils/interfaces";
export type UploadChunkVariant = "create" | "update";

export const postUploadChunk = async (body: FormData, variant: UploadChunkVariant): Promise<ResponseData> => {
  try {
    const response = await apiClient.POST(`common/uploadChunk/file-dossier/${variant}`, body, true);

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrió un error al subir una parte del archivo",
        data: response.statusText,
      };
    }

    return {
      error: false,
      message: "Chunk del archivo creado o actualizado correctamente",
    };
  } catch (e: any) {
    const webError = webActionError(e);

    if (webError) return webError;

    return {
      error: true,
      message: "Error al crear o actualizar el archivo",
    };
  }
};
