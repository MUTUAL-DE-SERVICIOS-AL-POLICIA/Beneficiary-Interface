"use server";
import { apiClient, apiClientBiometric } from "@/services";

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

export const getRegisteredFingerprints = async (personId: number) => {
  try {
    const response = await apiClient.GET(`persons/showPersonFingerprint/${personId}`);
    const { status } = response;
    const responseData = await response.json();

    if (status == 200) {
      const { fingerprints } = responseData;

      return {
        error: false,
        message: "Obtención de huellas registradas exitosamente",
        fingerprintsRegistered: fingerprints,
      };
    }
    if (status >= 400) {
      const { message } = responseData;

      return {
        error: true,
        message: message,
        fingerprintsRegistered: [],
      };
    }

    return {
      error: true,
      message: "Ocurrio un error",
      fingerprintsRegistered: [],
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener las huellas registradas",
      fingerprintsRegistered: [],
    };
  }
};

export const getAllFingerprintsIds = async () => {
  try {
    const response = await apiClient.GET(`persons/showListFingerprint`);
    const { status } = response;
    const responseData = await response.json();

    if (status == 200) {
      return {
        error: false,
        message: "Obtención de todas las huellas a registrar exitosamente",
        fingerprints: responseData,
      };
    }
    if (status >= 400) {
      const { message } = responseData;

      return {
        error: true,
        message,
        fingerprints: [],
      };
    }

    return {
      error: true,
      message: "Ocurrio un error",
      fingerprints: [],
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener el id de las huellas",
      fingerprints: [],
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
      message: "Ocurrio un error",
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
      message: "Ocurrio un error",
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al capturar una huella",
    };
  }
};

export const registerFingerprints = async (personId: number, fingerprints: any) => {
  try {
    const response = await apiClient.POST("persons/createPersonFingerprint", {
      personId,
      fingerprints,
    });
    const { status } = response;
    const responseData = await response.json();

    if (status == 201) {
      const { message } = responseData;

      return {
        error: false,
        message,
      };
    }
    if (status >= 400) {
      return {
        error: true,
        message: "Error al registrar las huellas",
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
      message: "Error al registrar las huellas",
    };
  }
};
