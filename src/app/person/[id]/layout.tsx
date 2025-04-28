import { ReactNode } from "react";

import { AffiliateProvider } from "@/utils/context/AffiliateContext";
import { PersonProvider } from "@/utils/context/PersonContext";
import { getAffiliate } from "@/api/affiliate/api";
import { getPerson } from "@/api/person/api";
import { Sidebar } from "@/components/persons";
import { Affiliate, AffiliateState, Category, Degree, Unit } from "@/utils/interfaces";
import { createEmptyObject } from "@/utils/helpers/utils";

interface ProfileLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
  const { id: personId } = await params;
  const { isAffiliate, person, personAffiliate, error } = await getPerson(personId);

  let affiliateData: Affiliate = createEmptyObject<Affiliate>(),
    affiliateState: AffiliateState = createEmptyObject<AffiliateState>(),
    degree: Degree = createEmptyObject<Degree>(),
    unit: Unit = createEmptyObject<Unit>(),
    category: Category = createEmptyObject<Category>();

  if (isAffiliate) {
    const { typeId: affiliateId } = personAffiliate[0];

    ({ affiliateData, affiliateState, degree, unit, category } = await getAffiliate(affiliateId));
  }

  return (
    <PersonProvider error={error} person={person} personAffiliate={personAffiliate}>
      <div className="flex flex-row gap-4 w-[1280px]">
        <div className="flex flex-col">
          <Sidebar />
        </div>
        <AffiliateProvider
          affiliateData={affiliateData}
          affiliateState={affiliateState}
          category={category}
          degree={degree}
          unit={unit}
        >
          <div className="flex flex-col">{children}</div>
        </AffiliateProvider>
      </div>
    </PersonProvider>
  );
}
