import { KinshipDto, PersonAffiliateDto, PersonDto, PersonsDto } from "./dto";

import { Kinship, Person, PersonAffiliate } from "@/utils/interfaces";

export const transformToPerson = (
  personDto: PersonDto,
): {
  isAffiliate: boolean;
  personData: Omit<Person, "personAffiliate">;
  personAffiliate: PersonAffiliate[];
} => {
  const {
    id,
    firstName,
    secondName,
    lastName,
    mothersLastName,
    surnameHusband,
    identityCard,
    dueDate,
    isDuedateUndefined,
    gender,
    civilStatus,
    birthDate,
    dateDeath,
    deathCertificateNumber,
    reasonDeath,
    phoneNumber,
    cellPhoneNumber,
    accountNumber,
    sigepStatus,
    birthDateLiteral,
    cityBirth,
    pensionEntity,
    financialEntity,
  } = personDto;

  const fullName = [firstName, secondName, lastName, mothersLastName, surnameHusband]
    .filter(Boolean) // Filtrar valores nulos o vacíos
    .join(" ");

  const personData = {
    id,
    firstName,
    secondName,
    lastName,
    mothersLastName,
    fullName,
    surnameHusband,
    identityCard,
    dueDate,
    isDuedateUndefined,
    gender,
    civilStatus,
    birthDate,
    dateDeath,
    deathCertificateNumber,
    reasonDeath,
    phoneNumber,
    cellPhoneNumber,
    accountNumber,
    sigepStatus,
    birthDateLiteral,
    cityBirth,
    pensionEntity,
    financialEntity,
  };

  const personAffiliate = personDto.personAffiliate.map((affiliateDto) =>
    transformToPersonAffiliate(affiliateDto),
  );
  const isAffiliate = personDto.personAffiliate?.length > 0;

  return {
    isAffiliate,
    personData,
    personAffiliate,
  };
};

const transformToPersonAffiliate = (affiliateDto: PersonAffiliateDto): PersonAffiliate => {
  return {
    typeId: affiliateDto.typeId,
    kinship: transformToKinship(affiliateDto.kinship),
  };
};

const transformToKinship = (kinshipDto: KinshipDto): Kinship => {
  return {
    id: kinshipDto.id,
    name: kinshipDto.name,
  };
};

export const transformToPersons = (
  personsDto: PersonsDto[],
): {
  personsData: Pick<
    Person,
    "id" | "firstName" | "secondName" | "lastName" | "mothersLastName" | "identityCard" | "gender"
  >[];
} => {
  const personsData = personsDto.map((personDto) => {
    const { id, firstName, secondName, lastName, mothersLastName, identityCard, gender } = personDto;

    return {
      id,
      firstName,
      secondName,
      lastName,
      mothersLastName,
      identityCard,
      gender,
    };
  });

  return { personsData };
};
