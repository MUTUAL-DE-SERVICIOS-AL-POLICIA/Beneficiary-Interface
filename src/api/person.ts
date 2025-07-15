"use server";

import { apiClient } from "@/utils/services";
import { ResponseData } from "@/utils/interfaces";

export const getPersons = async (
  limit: number = 10,
  page: number = 1,
  filter?: string,
  orderBy?: string,
  order?: string,
): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET("/persons", {
      limit,
      page,
      ...(filter ? { filter } : {}),
      ...(orderBy ? { orderBy } : {}),
      ...(order ? { order } : {}),
    });
    const { status }: { status: number } = response;
    const responseData = await response.json();

    if (status == 200) {
      return {
        error: false,
        message: "Beneficiarios obtenidos exitosamente",
        persons: responseData.persons,
        total: responseData.total,
      };
    }
    if (status >= 400) {
      const { message }: { message: string } = responseData;

      return {
        error: true,
        message: message,
        persons: [],
        total: 0,
      };
    }

    return {
      error: true,
      message: "Ocurrió un error",
      persons: [],
      total: 0,
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener el listado de personas",
      persons: [],
      total: 0,
    };
  }
};

export const getPerson = async (uuid: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`persons/${uuid}/details`);
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
      message: "Datos de la persona obtenido exitosamente",
      data,
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener datos de la persona",
      data: e.message,
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
      message: "Ocurrió un error",
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
    const data = await response.json();

    if (status == 200) {
      return {
        error: false,
        message: "Obtención de todas las huellas a registrar exitosamente",
        data,
      };
    }
    if (status >= 400) {
      const { message } = data;

      return {
        error: true,
        message,
        data: [],
      };
    }

    return {
      error: true,
      message: "Ocurrió un error",
      data: [],
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener el id de las huellas",
      data: [],
    };
  }
};

export const getAffiliates = async (id: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`persons/${id}/affiliates`);
    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrió un error al obtener los afiliados",
      };
    }

    return {
      error: false,
      message: "Afiliados obtenidos exitosamente",
      data,
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener afiliados",
      data: e.message,
    };
  }
};

export const getBeneficiaries = async (id: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`persons/${id}/beneficiaries`);
    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrió un error al obtener los beneficiarios",
        data: response.statusText,
      };
    }

    return {
      error: false,
      message: "Beneficiarios obtenidos exitosamente",
      data,
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener beneficiarios",
      data: e.message,
    };
  }
};

export const postFingerprints = async (
  personId: number,
  body: {
    personFingerprints: any[];
    wsqFingerprints: any[];
  },
) => {
  try {
    const response = await apiClient.POST(`persons/${personId}/createPersonFingerprint`, body);
    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: "Ocurrió un error al registrar las huellas",
        data: response.statusText,
      };
    }

    return {
      error: false,
      message: data.message || "Huella(s) registradas exitosamente",
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener datos de la persona",
      data: e.message,
    };
  }
};
