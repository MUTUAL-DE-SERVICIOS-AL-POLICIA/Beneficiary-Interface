"use client";

import { CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";

import { UserInfo, TabsSidebar } from "./";

import { basicPersonInfo } from "@/utils/types";
import { Features } from "@/utils/interfaces";
import { usePermissions } from "@/utils/auth/permission-context";

interface Props {
  user: basicPersonInfo;
  features: Features;
}

export const Sidebar = ({ user, features }: Props) => {
  const { can } = usePermissions();
  const person = [
    { name: "DATOS PERSONALES", key: "personalData", icon: "PersonalDataIcon" },
    { name: "HUELLAS DACTILARES", key: "fingerprints", icon: "TouchIcon" },
  ].filter((item) => item.key !== "fingerprints" || can("persons.fingerprints", "read"));

  const police = [
    { name: "DATOS POLICIALES", key: "policeData", icon: "PoliceDataIcon" },
    { name: "DOCUMENTOS", key: "documents", icon: "DocumentsDataIcon" },
    { name: "EXPEDIENTES", key: "fileDossiers", icon: "FileDossiersIcon" },
  ].filter((item) => {
    if (item.key === "documents") return can("affiliates.documents", "read");
    if (item.key === "fileDossiers") return can("affiliates.file_dossiers", "read");
    return true;
  });

  const beneficiaries = can("persons.affiliates", "read")
    ? [{ name: "BENEFICIARIOS", key: "beneficiaries", icon: "BeneficiariesDataIcon" }]
    : [];

  const affiliates = can("affiliates", "read")
    ? [{ name: "AFILIADOS", key: "affiliates", icon: "AffiliateDataIcon" }]
    : [];

  return (
    <>
      <CardHeader className="justify-center">
        <UserInfo isCopy isPolice={features.isPolice} user={user} />
      </CardHeader>
      <Divider className="bg-gray-400 w-full" />
      <CardBody>
        <TabsSidebar tabSidebar={person} />

        {features.isPolice && (
          <>
            <TabsSidebar tabSidebar={police} />
          </>
        )}
        {features.hasBeneficiaries && (
          <>
            <TabsSidebar tabSidebar={beneficiaries} />
          </>
        )}
        {features.hasAffiliates && (
          <>
            <TabsSidebar tabSidebar={affiliates} />
          </>
        )}
      </CardBody>
    </>
  );
};
