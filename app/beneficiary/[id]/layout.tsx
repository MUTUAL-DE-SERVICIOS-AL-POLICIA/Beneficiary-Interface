import { ReactNode } from 'react';
import Sidebar from '@/components/sidebar';
import React from 'react';
import { getBeneficiary } from '../service';
import { BeneficiaryProvider } from '@/context/BeneficiaryContext';

interface BeneficiaryLayoutProps {
  children: ReactNode;
  params: { id: string }
}

export default async function BeneficiaryLayout({ children, params }: BeneficiaryLayoutProps) {

  const response = await getBeneficiary(params.id)
  const error = response.error
  const beneficiaryData = !error ? response.data : []

  return (
    <BeneficiaryProvider data={beneficiaryData} error={error}>
      <div className="flex flex-row gap-4 w-[1280px]">
        <div className="flex flex-col">
          <Sidebar/>
        </div>
        <div className="flex flex-col">
          { children }
        </div>
      </div>
    </BeneficiaryProvider>
  );
}