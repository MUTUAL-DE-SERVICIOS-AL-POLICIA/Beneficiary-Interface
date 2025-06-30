"use client";
import { useSearchParams } from "next/navigation";

import {
  PersonalData,
  PoliceData,
  Documents,
  Fingerprints,
  Beneficiaries,
  Affiliates,
  FileDossiers,
} from "@/components/persons/sidebarMenu";

export default function Page() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("feature") ?? "personalData";

  const renderContent = () => {
    switch (currentTab) {
      case "fingerprints":
        return <Fingerprints />;
      case "policeData":
        return <PoliceData />;
      case "documents":
        return <Documents />;
      case "fileDossiers":
        return <FileDossiers />;
      case "beneficiaries":
        return <Beneficiaries />;
      case "affiliates":
        return <Affiliates />;
      default:
        return <PersonalData />;
    }
  };

  return renderContent();
}
