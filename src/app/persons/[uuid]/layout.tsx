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
  };

  return (
    <PersonProvider
      affiliateId={String(data.nup)}
      cityBirth={data.cityBirth}
      financialEntity={data.financialEntity}
      pensionEntity={data.pensionEntity}
      person={data}
    >
      <Card className="flex flex-col md:flex-row gap-2 py-2 px-2">
        <Sidebar features={data.features} user={basicInfo} />
        <Card className="w-full md:flex-1 border-small rounded-small border-default-200 dark:border-default-200 min-h-[470px] 2xl:min-h-[700px]">
          {children}
        </Card>
      </Card>
    </PersonProvider>
  );
}
