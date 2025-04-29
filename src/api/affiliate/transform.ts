import { AffiliateDto } from "./dto";

import { Affiliate, AffiliateState, Category, Degree, Unit } from "@/utils/interfaces";

export const transformToAffiliate = (
  affiliateDto: AffiliateDto,
): {
  affiliateData: Omit<Affiliate, "affiliateState" | "degree" | "unit" | "category">;
  affiliateState: AffiliateState;
  degree: Degree;
  unit: Unit;
  category: Category;
} => {
  const {
    id,
    registration,
    type,
    dateEntry,
    dateDerelict,
    reasonDerelict,
    serviceYears,
    serviceMonths,
    unitPoliceDescription,
    official,
    book,
    departure,
    marriageDate,
    affiliateState,
    degree,
    unit,
    category,
  } = affiliateDto;

  const affiliateData = {
    id,
    registration,
    type,
    dateEntry,
    dateDerelict,
    reasonDerelict,
    serviceYears,
    serviceMonths,
    unitPoliceDescription,
    official,
    book,
    departure,
    marriageDate,
  };

  return {
    affiliateData,
    affiliateState,
    degree,
    unit,
    category,
  };
};
