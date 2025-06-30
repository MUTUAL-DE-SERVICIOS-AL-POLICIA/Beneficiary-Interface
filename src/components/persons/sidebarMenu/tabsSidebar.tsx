"use client";
import React from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

import { TabSidebar } from "@/utils/interfaces";
import {
  TouchIcon,
  ChevronRightIcon,
  PersonalDataIcon,
  PoliceDataIcon,
  DocumentsDataIcon,
  AffiliateDataIcon,
  BeneficiariesDataIcon,
  FileDossiersIcon,
} from "@/components/common";

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

  const verticalTabStyles = {
    tabList: "flex w-full",
    cursor: "w-full bg-green-900",
    tab: "w-full px-0 h-9 border-gray-400",
    tabContent:
      "flex items-center justify-start gap-2 text-left text-black-900 w-full group-data-[selected=true]:text-green-900 group-data-[selected=true]:font-bold group-data-[selected=true]:bg-green-100 group-data-[selected=true]:rounded-lg group-data-[selected=true]:text-lg",
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
      classNames={verticalTabStyles}
      isVertical={true}
      selectedKey={currentTab}
      variant="underlined"
      onSelectionChange={(key) => handleTabChange(String(key))}
    >
      {tabSidebar.map((tab) => {
        const IconComponent = iconsMap[tab.icon];

        return (
          <Tab
            key={tab.key}
            title={
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-2">
                  {IconComponent && <IconComponent />}
                  <span>{tab.name}</span>
                </div>
                <ChevronRightIcon className="text-2xl" />
              </div>
            }
          />
        );
      })}
    </Tabs>
  );
};
