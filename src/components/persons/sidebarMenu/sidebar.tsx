import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";

import { UserInfo, TabsSidebar } from "./";

import { basicPersonInfo } from "@/utils/types";
import { Features } from "@/utils/interfaces";

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
  ];

  const beneficiaries = [{ name: "BENEFICIARIOS", key: "beneficiaries", icon: "BeneficiariesDataIcon" }];

  const affiliates = [{ name: "AFILIADOS", key: "affiliates", icon: "AffiliateDataIcon" }];

  return (
    <Card className="w-full max-w-[300px] border-small rounded-small border-default-200 dark:border-default-200">
      <CardHeader className="justify-center">
        <UserInfo isPolice={features.isPolice} user={user} />
      </CardHeader>
      <Divider />
      <CardBody>
        <TabsSidebar tabSidebar={person} />
        <Divider className="py-1" />

        {features.isPolice && (
          <>
            <TabsSidebar tabSidebar={police} />
            <Divider className="py-1" />
          </>
        )}

        {features.hasBeneficiaries && (
          <>
            <TabsSidebar tabSidebar={beneficiaries} />
            <Divider className="py-1" />
          </>
        )}

        {features.hasAffiliates && (
          <>
            <TabsSidebar tabSidebar={affiliates} />
            <Divider className="py-1" />
          </>
        )}
      </CardBody>
    </Card>
  );
};
