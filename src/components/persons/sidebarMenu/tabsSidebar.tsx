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
    cursor: "w-full bg-green-800",
    tab: "w-full px-0 h-10 border-b border-gray-400",
    tabContent:
      "flex items-center justify-start gap-2 text-left text-black-700 w-full group-data-[selected=true]:text-green-800 group-data-[selected=true]:font-bold",
  };

  const iconsMap: Record<string, React.ComponentType<any>> = {
    TouchIcon,
    PersonalDataIcon,
    PoliceDataIcon,
    DocumentsDataIcon,
    AffiliateDataIcon,
    BeneficiariesDataIcon,
  };

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        className="w-full"
        classNames={verticalTabStyles}
        color="primary"
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
                  <ChevronRightIcon className="text-xl" />
                </div>
              }
            />
          );
        })}
      </Tabs>
    </div>
  );
};
