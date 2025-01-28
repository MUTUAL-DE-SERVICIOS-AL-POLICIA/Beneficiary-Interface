"use client";
import { createContext } from "react";

import { AffiliateState } from "../domain/index";

import { Affiliate, Category, Degree, Unit } from "@/domain";

interface AffiliateContextProps {
  affiliateData: Affiliate;
  affiliateState: AffiliateState;
  degree: Degree;
  unit: Unit;
  category: Category;
}

export const AffiliateContext = createContext<AffiliateContextProps | undefined>(undefined);

export const AffiliateProvider: React.FC<{
  affiliateData: Affiliate;
  affiliateState: AffiliateState;
  degree: Degree;
  unit: Unit;
  category: Category;
  children: React.ReactNode;
}> = ({ affiliateData, affiliateState, degree, unit, category, children }) => {
  return (
    <AffiliateContext.Provider
      value={{
        affiliateData: affiliateData,
        affiliateState: affiliateState,
        degree: degree,
        unit: unit,
        category: category,
      }}
    >
      {children}
    </AffiliateContext.Provider>
  );
};
