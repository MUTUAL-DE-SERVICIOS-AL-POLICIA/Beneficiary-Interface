export interface BasePersonDto {
  id: number;
  firstName: string;
  secondName: string | null;
  lastName: string;
  mothersLastName: string;
  surnameHusband: string | null;
  identityCard: string;
  dueDate: Date | null;
  isDuedateUndefined: boolean | null;
  gender: string;
  civilStatus: string;
  birthDate: Date | string;
  dateDeath: Date | null;
  deathCertificateNumber: string | null;
  reasonDeath: string | null;
  phoneNumber: string | null;
  cellPhoneNumber: string | null;
  accountNumber: string | null;
  sigepStatus: string | null;
  cityBirth: string | null;
  pensionEntity: PensionEntity;
  financialEntity: FinancialEntity;
  message: string | null;
}

export interface FinancialEntity {
  id: number;
  name: string;
}

export interface PensionEntity {
  id: number;
  type: string;
  name: string;
  isActive: boolean;
}

export interface PersonsDto extends BasePersonDto {
  uuidColumn: string;
  nua: number;
  isPersonSenasir: boolean;
  dateLastContribution: Date | string;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  deletedAt: Date | string | null;
}

export interface PersonDto extends BasePersonDto {
  birthDateLiteral: string;
  personAffiliate: PersonAffiliateDto[];
}

export interface PersonAffiliateDto {
  id: number;
  type: string;
  typeId: number;
  state: boolean;
  kinship: KinshipDto;
}

export interface KinshipDto {
  id: number;
  name: string;
}
