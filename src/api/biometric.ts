"use server";
import { apiClientBiometric } from "@/utils/services";
import { ResponseData } from "@/utils/interfaces";

export const checkBiometricStatus = async () => {
  try {
    const client = await apiClientBiometric();
    const response = await client.GET("/biometrico/dispositivos");
    const { status } = response;
    const responseData = await response.json();

    if (status == 200) {
      if (Array.isArray(responseData)) {
        if (responseData.length !== 0) {
          return {
            error: false,
            message: "Servicio de biométrico disponible",
            data: responseData,
          };
        }
      }
    }

    return {
      error: true,
      message: "Servicio de biometrico no disponible",
      data: [],
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "No se puede comprobar la disponibilidad del servicio de biometrico",
      data: [],
    };
  }
};

export const captureTwoFingerprints = async () => {
  try {
    const { error, message } = await checkBiometricStatus();

    if (!error) {
      const client = await apiClientBiometric();
      const response = await client.GET(`biometrico/capturar/huellas`);
      const { status } = response;
      const responseData = await response.json();

      if (status == 200) {
        const { message, data } = responseData;

        return {
          error: false,
          message,
          data,
        };
      }
      if (status >= 400) {
        const { message } = responseData;

        return {
          error: true,
          message,
        };
      }
    } else {
      return {
        error: true,
        message,
      };
    }

    return {
      error: true,
      message: "Ocurrió un error",
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al capturar las huellas",
    };
  }
};

export const captureOneFingerprint = async () => {
  try {
    const { error, message } = await checkBiometricStatus();

    if (!error) {
      const client = await apiClientBiometric();
      const response = await client.GET(`biometrico/capturar/huella`);
      const { status } = response;
      const responseData = await response.json();

      if (status == 200) {
        const { message, data } = responseData;

        return {
          error: false,
          message,
          data,
        };
      }
      if (status >= 400) {
        const { message } = responseData;

        return {
          error: true,
          message,
        };
      }
    } else {
      return {
        error: true,
        message,
      };
    }

    return {
      error: true,
      message: "Ocurrió un error",
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al capturar una huella",
    };
  }
};

export const captureStop = async (): Promise<ResponseData> => {
  try {
    const client = await apiClientBiometric();
    const response = await client.GET(`biometrico/capturar/detener`);

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrió un error al detener la captura",
      };
    }

    return {
      error: false,
      message: "Captura detenida exitosamente",
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al detener la captura de huella(s)",
    };
  }
};
