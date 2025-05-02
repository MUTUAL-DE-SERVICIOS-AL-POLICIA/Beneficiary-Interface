"use server";
import { PersonsDto } from "./dto";
import { transformToPerson, transformToPersons } from "./transform";

import { Person, PersonAffiliate, TablePersons } from "@//utils/interfaces";
import { createEmptyObject } from "@/utils/helpers/utils";
import { apiClient } from "@/utils/services";
import { ResponseData } from "@/utils/types";

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
      const { persons, total }: { persons: PersonsDto[]; total: number } = responseData;
      const { personsData }: { personsData: TablePersons[] } = transformToPersons(persons);

      return {
        error: false,
        message: "Beneficiarios obtenidos exitosamente",
        persons: personsData,
        total: total,
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
      message: "Ocurrio un error",
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

export const getPerson = async (personId: string): Promise<ResponseData> => {
  try {
    const response = await apiClient.GET(`persons/findPersonAffiliatesWithDetails/${personId}`);
    const { status }: { status: number } = response;
    const responseData = await response.json();

    if (status == 200) {
      const {
        isAffiliate,
        personData,
        personAffiliate,
      }: { isAffiliate: boolean; personData: Person; personAffiliate: PersonAffiliate[] } =
        transformToPerson(responseData);

      return {
        error: false,
        message: "Datos de la persona obtenido exitosamente",
        isAffiliate: isAffiliate,
        person: personData,
        personAffiliate: personAffiliate,
      };
    }
    if (status >= 400) {
      const { message } = responseData;

      return {
        error: true,
        message: message,
        isAffiliate: false,
        person: createEmptyObject<Person>(),
        personAffiliate: createEmptyObject<PersonAffiliate>(),
      };
    }

    return {
      error: true,
      message: "Ocurrio un error",
      isAffiliate: false,
      person: createEmptyObject<Person>(),
      personAffiliate: createEmptyObject<PersonAffiliate>(),
    };
  } catch (e: any) {
    console.error(e);

    return {
      error: true,
      message: "Error al obtener datos de la persona",
      isAffiliate: false,
      person: createEmptyObject<Person>(),
      personAffiliate: createEmptyObject<PersonAffiliate>(),
    };
  }
};
