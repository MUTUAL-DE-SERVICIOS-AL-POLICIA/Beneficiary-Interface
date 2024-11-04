"use client"
import React, { createContext, useContext } from 'react'

interface BeneficiaryContextProps {
  beneficiaryData: any
}

const BeneficiaryContext = createContext<BeneficiaryContextProps | undefined>(undefined)

export const BeneficiaryProvider: React.FC<{ value: any; children: React.ReactNode}> = ({ value, children }) =>{
  return (
    <BeneficiaryContext.Provider value={{ beneficiaryData: value }}>
      { children }
    </BeneficiaryContext.Provider>
  )
}

export const useBeneficiary = () => {
  const context = useContext(BeneficiaryContext)
  if(context === undefined) {
    throw new Error("useBeneficiary must be used within a BeneficiaryProvider")
  }
  return context
}