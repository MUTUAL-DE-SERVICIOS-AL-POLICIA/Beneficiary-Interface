"use client";
import { useContext } from "react";

import { AffiliateContext } from "@/context/AffiliateContext";

export const useAffiliate = () => {
  const context = useContext(AffiliateContext);

  if (context === undefined) {
    throw new Error("useAffiliate debe usar con AffiliateProvider");
  }

  return context;
};
