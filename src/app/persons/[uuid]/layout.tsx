import { Card } from "@heroui/react";
import { ReactNode } from "react";

import { getPerson } from "@/api/person";
import { AlertServer, BreadcrumbsState } from "@/components";
import { Options, Sidebar } from "@/components/persons/sidebarMenu";
import { PersonProvider } from "@/context";

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
      <div className="flex justify-between items-center pb-2 w-full">
        <div>
          <BreadcrumbsState />
        </div>
        <Options />
      </div>

      <section className="flex justify-center md:flex-row flex-wrap gap-1 h-[calc(100vh-135px)]">
        <Card className="flex-1 min-w-62.5 max-w-75 2xl:max-w-100 border-small rounded-small border-default-200 dark:border-default-600 h-full">
          <Sidebar features={data.features} user={basicInfo} />
        </Card>

        <Card className="card-no-outline flex-1 border border-default-200 dark:border-default-600 rounded-medium p-3 min-w-[650px] h-full">
          {children}
        </Card>
      </section>
    </PersonProvider>
  );
}
