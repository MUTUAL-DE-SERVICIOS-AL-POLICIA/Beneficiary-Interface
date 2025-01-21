export interface AffiliateDto {
  id: number;
  registration: string | null;
  type: string;
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
  affiliateState: affiliateStateDto;
  degree: degreeDto;
  unit: unitDto;
  category: categoryDto;
}

export interface affiliateStateDto {
  id: number;
  name: string;
  stateType: stateTypeDto;
}

export interface stateTypeDto {
  id: number;
  name: string;
}

export interface degreeDto {
  id: number;
  name: string;
  status: boolean;
}

export interface unitDto {
  id: number;
  district: string;
  name: string;
  status: boolean;
}

export interface categoryDto {
  id: number;
  name: string;
  percentage: string;
  status: boolean;
}
