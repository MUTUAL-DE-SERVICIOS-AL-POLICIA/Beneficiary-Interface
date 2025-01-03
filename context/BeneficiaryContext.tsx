"use client";
import React, { createContext, useContext } from "react";

import AlertProvider from "./AlertProvider";

interface BeneficiaryContextProps {
  beneficiaryData: any;
  error: any;
}

const BeneficiaryContext = createContext<BeneficiaryContextProps | undefined>(undefined);

export const BeneficiaryProvider: React.FC<{
  data: any;
  error: any;
  children: React.ReactNode;
}> = ({ data, error, children }) => {
  return (
    <AlertProvider>
      <BeneficiaryContext.Provider value={{ beneficiaryData: data, error: error }}>
        {children}
      </BeneficiaryContext.Provider>
    </AlertProvider>
  );
};

export const useBeneficiary = () => {
  const context = useContext(BeneficiaryContext);

  if (context === undefined) {
    throw new Error("useBeneficiary must be used within a BeneficiaryProvider");
  }

  return context;
};
