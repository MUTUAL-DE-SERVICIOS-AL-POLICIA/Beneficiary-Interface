import { Card, Separator } from "@heroui/react";

import { TabsSidebar } from "./";

import { UserInfo } from "@/components";
import { Features } from "@/utils/interfaces";
import { basicPersonInfo } from "@/utils/types";

interface Props {
  user: basicPersonInfo;
  features: Features;
}

export const Sidebar = ({ user, features }: Props) => {
  const person = [
    { name: "DATOS PERSONALES", key: "personalData", icon: "PersonalDataIcon" },
    { name: "HUELLAS DACTILARES", key: "fingerprints", icon: "TouchIcon" },
  ];

  const police = [
    { name: "DATOS POLICIALES", key: "policeData", icon: "PoliceDataIcon" },
    { name: "DOCUMENTOS", key: "documents", icon: "DocumentsDataIcon" },
    { name: "EXPEDIENTES", key: "fileDossiers", icon: "FileDossiersIcon" },
  ];

  const beneficiaries = [{ name: "BENEFICIARIOS", key: "beneficiaries", icon: "BeneficiariesDataIcon" }];

  const affiliates = [{ name: "AFILIADOS", key: "affiliates", icon: "AffiliateDataIcon" }];

  return (
    <>
      <Card.Header className="justify-center">
        <UserInfo
          hasPhoto
          isDelete
          isEdit
          isRegister
          isPolice={features.isPolice}
          user={{ ...user, nup: user.nup?.toString() }}
        />
      </Card.Header>
      <Separator className="bg-gray-400 w-full" />
      <Card.Content className="flex flex-col gap-2">
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
      </Card.Content>
    </>
  );
};
