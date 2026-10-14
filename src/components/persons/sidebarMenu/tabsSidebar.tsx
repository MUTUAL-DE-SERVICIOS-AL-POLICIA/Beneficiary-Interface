"use client";
import { Tabs } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

import {
  AffiliateDataIcon,
  BeneficiariesDataIcon,
  ChevronRightIcon,
  DocumentsDataIcon,
  FileDossiersIcon,
  PersonalDataIcon,
  PoliceDataIcon,
  TouchIcon,
} from "@/components";
import { TabSidebar } from "@/utils/interfaces";

interface Props {
  tabSidebar: TabSidebar[];
}

export const TabsSidebar = ({ tabSidebar }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const nameTab = "feature";

  const currentTab = searchParams.get(nameTab) ?? "personalData";

  const handleTabChange = (key: string) => {
    router.push(`${pathname}?${nameTab}=${key}`);
  };

  const iconsMap: Record<string, React.ComponentType<any>> = {
    TouchIcon,
    PersonalDataIcon,
    PoliceDataIcon,
    DocumentsDataIcon,
    AffiliateDataIcon,
    BeneficiariesDataIcon,
    FileDossiersIcon,
  };

  return (
    <Tabs
      aria-label="Options"
      className="w-full"
      orientation="vertical"
      selectedKey={currentTab}
      variant="primary"
      onSelectionChange={(key) => handleTabChange(String(key))}
    >
      <Tabs.List className="flex w-full">
        {tabSidebar.map((tab) => {
          const IconComponent = iconsMap[tab.icon];

          return (
            <Tabs.Tab
              key={tab.key}
              className="group h-9 w-full border-gray-400 px-0 text-left data-[selected=true]:rounded-lg data-[selected=true]:bg-green-100 data-[selected=true]:text-lg data-[selected=true]:font-bold data-[selected=true]:text-green-900"
              id={tab.key}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center space-x-2">
                  {IconComponent && <IconComponent />}
                  <span>{tab.name}</span>
                </div>
                <ChevronRightIcon className="text-2xl" />
              </div>
            </Tabs.Tab>
          );
        })}
      </Tabs.List>
    </Tabs>
  );
};
