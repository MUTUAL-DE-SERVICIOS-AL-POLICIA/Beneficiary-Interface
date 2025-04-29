export interface ResponseData {
  error: boolean;
  message: string;
  [key: string]: any;
}

export interface User {
  id: string;
  name: string;
  username: string;
  identityCard?: string;
  position?: string;
}
export interface TablePersons
  extends Pick<
    Person,
    "id" | "firstName" | "secondName" | "mothersLastName" | "lastName" | "identityCard" | "gender"
  > {}

export interface Person {
  id: number;
  firstName: string;
  secondName: string | null;
  lastName: string;
  mothersLastName: string;
  fullName: string;
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
  birthDateLiteral: string;
  personAffiliate?: PersonAffiliate[];
  cityBirth: string | null;
  pensionEntity: PensionEntity;
  financialEntity: FinancialEntity;
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

export interface PersonAffiliate {
  typeId: number;
  kinship: Kinship;
}

export interface Kinship {
  id: number;
  name: string;
}

export interface Affiliate {
  id: number | null;
  registration: string | null;
  type: string | null;
  dateEntry: Date | string | null;
  dateDerelict: Date | string | null;
  reasonDerelict: string | null;
  serviceYears: number | null;
  serviceMonths: number | null;
  unitPoliceDescription: string | null;
  official: string | null;
  book: string | null;
  departure: string | null;
  marriageDate: Date | string | null;
}

export interface AffiliateState {
  id: number | null;
  name: string | null;
  stateType: StateType | null;
}

export interface StateType {
  id: number | null;
  name: string | null;
}

export interface Degree {
  id: number | null;
  name: string | null;
  status: boolean | null;
}

export interface Unit {
  id: number | null;
  district: string | null;
  name: string | null;
  status: boolean | null;
}

export interface Category {
  id: number | null;
  name: string | null;
  percentage: string | null;
  status: boolean | null;
}
