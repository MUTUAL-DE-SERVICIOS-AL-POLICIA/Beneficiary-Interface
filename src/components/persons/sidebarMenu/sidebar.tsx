import { CardBody, CardHeader } from "@heroui/card";
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
    <>
      <CardHeader className="justify-center">
        <UserInfo isCopy isPolice={features.isPolice} user={user} />
      </CardHeader>
      <Divider />
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
