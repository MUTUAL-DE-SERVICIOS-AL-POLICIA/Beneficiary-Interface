import { Card } from "@heroui/card";
import { ReactNode } from "react";

import { getPerson } from "@/api/person";
import { AlertServer } from "@/components/common";
import { Sidebar } from "@/components/persons/sidebarMenu";
import { PersonProvider } from "@/utils/context/PersonContext";

interface ProfileLayoutProps {
  children: ReactNode;
  params: Promise<{ uuid: string }>;
}

export default async function Layout({ children, params }: ProfileLayoutProps) {
  const { uuid } = await params;
  const { error, message, data } = await getPerson(uuid);

  if (error) {
    return <AlertServer color="warning" description={message} />;
  }

  const fullName = String(
    [data.firstName, data.secondName, data.lastName, data.mothersLastName].filter(Boolean).join(" "),
  );

  const basicInfo = {
    fullName: fullName,
    nup: data.nup,
    identityCard: data.identityCard,
    state: true,
  };

  return (
    <PersonProvider
      affiliateId={String(data.nup)}
      cityBirth={data.cityBirth}
      financialEntity={data.financialEntity}
      pensionEntity={data.pensionEntity}
      person={data}
    >
      <Card className="flex-1 min-w-[250px] max-w-[300px] 2xl:max-w-[400px] border-small rounded-small border-default-200 dark:border-default-200 h-full">
        <Sidebar features={data.features} user={basicInfo} />
      </Card>

      <Card className="flex-1 min-w-[650px] border-small rounded-small border-default-200 dark:border-default-200 p-3 space-y-3 h-full">
        {children}
      </Card>
    </PersonProvider>
  );
}
