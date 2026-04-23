"use client";
import { CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";

import { UserInfo, TabsSidebar } from "./";

import { basicPersonInfo } from "@/utils/types";
import { Features } from "@/utils/interfaces";
import { usePermissions } from "@/utils/context/PermissionsContext";

interface Props {
  user: basicPersonInfo;
  features: Features;
}

export const Sidebar = ({ user, features }: Props) => {
  const { can } = usePermissions();

  const person = [
    { name: "DATOS PERSONALES", key: "personalData", icon: "PersonalDataIcon" },
    ...(can("persons.fingerprints", "read")
      ? [{ name: "HUELLAS DACTILARES", key: "fingerprints", icon: "TouchIcon" }]
      : []),
  ];

  const police = [
    ...(can("affiliates", "read")
      ? [{ name: "DATOS POLICIALES", key: "policeData", icon: "PoliceDataIcon" }]
      : []),
    ...(can("affiliates.documents", "read")
      ? [{ name: "DOCUMENTOS", key: "documents", icon: "DocumentsDataIcon" }]
      : []),
    ...(can("affiliates.file_dossiers", "read")
      ? [{ name: "EXPEDIENTES", key: "fileDossiers", icon: "FileDossiersIcon" }]
      : []),
  ];

  const beneficiaries = [{ name: "BENEFICIARIOS", key: "beneficiaries", icon: "BeneficiariesDataIcon" }];

  const affiliates = [{ name: "AFILIADOS", key: "affiliates", icon: "AffiliateDataIcon" }];

  return (
    <>
      <CardHeader className="justify-center">
        <UserInfo isCopy isPolice={features.isPolice} user={user} />
      </CardHeader>
      <Divider className="bg-gray-400 w-full" />
      <CardBody>
        <TabsSidebar tabSidebar={person} />

        {features.isPolice && police.length > 0 && (
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
