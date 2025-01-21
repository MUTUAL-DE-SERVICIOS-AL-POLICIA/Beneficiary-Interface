import { ReactNode } from "react";

import { getPerson } from "@/api/person/api";
import { PersonProvider } from "@/context/PersonContext";

import { Sidebar } from "@/components/sidebar";
import { getAffiliate } from "@/api/affiliate/api";
import { AffiliateProvider } from "../../../context/AffiliateContext";
import { Affiliate, AffiliateState, Category, Degree, Unit } from "@/domain";

interface BeneficiaryLayoutProps {
  children: ReactNode;
  params: { id: string };
}

export default async function BeneficiaryLayout({ children, params }: BeneficiaryLayoutProps) {
  const { id: personId } = params;
  const { isAffiliate, person, personAffiliate, error } = await getPerson(personId);

  let affiliateData: Affiliate = {
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
    },
    affiliateState: AffiliateState = {
      id: null,
      name: null,
      stateType: null,
    },
    degree: Degree = {
      id: null,
      name: null,
      status: null,
    },
    unit: Unit = {
      id: null,
      district: null,
      name: null,
      status: null,
    },
    category: Category = {
      id: null,
      name: null,
      percentage: null,
      status: null,
    };

  if (isAffiliate) {
    const { typeId: affiliateId } = personAffiliate[0];
    ({ affiliateData, affiliateState, degree, unit, category } = await getAffiliate(affiliateId));
  }

  return (
    <PersonProvider person={person} personAffiliate={personAffiliate} error={error}>
      <div className="flex flex-row gap-4 w-[1280px]">
        <div className="flex flex-col">
          <Sidebar />
        </div>
        <AffiliateProvider
          affiliateData={affiliateData}
          affiliateState={affiliateState}
          degree={degree}
          unit={unit}
          category={category}
        >
          <div className="flex flex-col">{children}</div>
        </AffiliateProvider>
      </div>
    </PersonProvider>
  );
}
