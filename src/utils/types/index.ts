import { SVGProps } from "react";

import { Person } from "@/utils/interfaces";
import { Affiliate, Category, Degree, Unit, AffiliateState, StateType } from "@/utils/interfaces";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type basicPersonInfo = Pick<Person, "identityCard" | "uuidColumn"> & {
  fullName: string;
  nup?: number;
  kinship?: string;
};

export type PoliceData = Affiliate & {
  category: Category;
  degree: Degree;
  unit: Unit;
  affiliateState: AffiliateState & {
    stateType: StateType;
  };
};

export const initialPoliceData: PoliceData = {
  id: null,
  registration: null,
  type: null,
  dateEntry: null,
  dateDerelict: null,
  reasonDerelict: null,
  serviceYears: null,
  serviceMonths: null,
  unitPoliceDescription: null,
  official: null,
  book: null,
  departure: null,
  marriageDate: null,
  category: {
    id: null,
    name: null,
    percentage: null,
    serviceStatus: false,
  },
  degree: {
    id: null,
    name: null,
    serviceStatus: false,
  },
  unit: {
    id: null,
    name: null,
    district: null,
    serviceStatus: false,
  },
  affiliateState: {
    id: null,
    name: null,
    stateType: {
      id: null,
      name: null,
    },
  },
};
