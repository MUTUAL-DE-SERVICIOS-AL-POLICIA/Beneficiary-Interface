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
import { usePermissions } from "@/utils/context/PermissionsContext";

const NO_PERMISSION = <p className="text-sm text-default-400 p-4">Sin permiso para acceder a esta sección.</p>;

export default function Page() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("feature") ?? "personalData";
  const { can } = usePermissions();

  const renderContent = () => {
    switch (currentTab) {
      case "fingerprints":
        return can("persons.fingerprints", "read") ? <Fingerprints /> : NO_PERMISSION;
      case "policeData":
        return can("affiliates", "read") ? <PoliceData /> : NO_PERMISSION;
      case "documents":
        return can("affiliates.documents", "read") ? <Documents /> : NO_PERMISSION;
      case "fileDossiers":
        return can("affiliates.file_dossiers", "read") ? <FileDossiers /> : NO_PERMISSION;
      case "beneficiaries":
        return can("persons", "read") ? <Beneficiaries /> : NO_PERMISSION;
      case "affiliates":
        return can("persons.affiliates", "read") ? <Affiliates /> : NO_PERMISSION;
      default:
        return can("persons", "read") ? <PersonalData /> : NO_PERMISSION;
    }
  };

  return renderContent();
}
