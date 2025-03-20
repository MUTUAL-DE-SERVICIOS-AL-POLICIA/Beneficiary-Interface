"use client";
// dependencias de diseno
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Listbox, ListboxItem, ListboxSection } from "@heroui/listbox";
// dependencias de la tecnologia
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AccordionComponent } from "@/components/accordion";
import { ListboxComponent } from "@/components/list";
import { sidebarConfig, SidebarItem } from "@/config/static";
import { usePerson } from "@/hooks/usePerson";

export function Sidebar() {
  const router = useRouter();
  const { personData } = usePerson();

  const [selectedPath, setSelectedPath] = useState("");
  const [activeItem, setActiveItem] = useState<string | number>("");
  const [expandedKey, setExpandedKey] = useState<string | number>("");

  const { sidebarItems } = sidebarConfig;

  const handleAction = (path: string) => {
    setSelectedPath(path);
    const { id: personId } = personData;

    router.push(`/person/${personId}/${path}`);
  };

  const toggleItem = (key: string | number) => {
    setExpandedKey((prevKey) => (prevKey === key ? "" : key));
  };

  const itemClasses = {
    base: "",
    title: "mt-0 mb-0 font-bold text-medium ",
    trigger: "",
    indicator: "text-medium",
  };

  const NUP = (prop: any) => {
    const { personAffiliate } = prop;

    if (personAffiliate.length !== 0) {
      const { typeId: nup } = personAffiliate[0];

      return (
        <div className="flex gap-1">
          <p className="font-semibold text-default-800 text-small">NUP:</p>
          <p className="text-default-600 text-small">{nup}</p>
        </div>
      );
    } else return <></>;
  };

  const QuickInformation = (props: any) => {
    const { fullName, identityCard, personAffiliateData } = props;

    return (
      <div className="flex my-4">
        <div className="flex flex-col gap-1 items-center">
          <Avatar
            isBordered
            showFallback
            className="my-2"
            radius="md"
            size="lg"
            src="https://nextui.org/avatars/avatars1.png"
          />
          <h4 className="text-medium font-semibold leading-none text-default-800 text-pretty text-center">
            {fullName}
          </h4>
          <NUP personAffiliate={personAffiliateData} />
          <div className="flex gap-1">
            <p className="font-semibold text-default-800 text-small"> C.I. </p>
            <p className="text-default-600 text-small">{identityCard}</p>
          </div>
        </div>
      </div>
    );
  };

  const PersonCard = () => {
    const { personData, personAffiliateData } = usePerson();
    const { fullName, identityCard } = personData;

    const classNames = {
      title: "text-small text-default-700",
      description: "font-semibold text-xs text-default-500",
      selectedIcon: "primary",
    };

    const handleSelectionChange = (keys: any) => {
      const key = Array.from(keys)[0];

      if (key !== undefined && key !== null) {
        setExpandedKey(key.toString() || "");
      }
    };

    const createExpandedKeySet = (expandedKey: string | number): Set<string | number> => {
      return expandedKey ? new Set([expandedKey]) : new Set();
    };

    const getAccordionItemClasses = (customKey: string | number): string =>
      `${itemClasses.base}
      mb-1 mt-0 pt-0 pb-5
      overflow-hidden rounded-lg
      ${activeItem === customKey ? "bg-default-300" : "bg-default-100"}
    `;

    const handleActionListbox = (path: string, customKey: string | number) => {
      handleAction(path);
      setActiveItem(customKey);
      toggleItem(customKey);
    };

    const renderSubMenu = (subMenu: any[]) => (
      <Listbox aria-label="sub listbox" defaultSelectedKeys="all" variant="flat">
        <ListboxSection>
          {subMenu.map(({ key, icon, path, title, description }) => (
            <ListboxItem
              key={key}
              classNames={classNames}
              description={description}
              endContent={icon}
              onPress={() => handleAction(path)}
            >
              {title}
            </ListboxItem>
          ))}
        </ListboxSection>
      </Listbox>
    );

    const renderAccordionItem = (item: Omit<SidebarItem, "handleAction">) => {
      const { title, customKey, path, subMenu, description, icon, topTitle } = item;

      if (title === "DATOS DE POLICIA" && (!personAffiliateData || personAffiliateData.length === 0)) {
        return null;
      }

      return (
        <AccordionItem
          key={customKey}
          className={getAccordionItemClasses(customKey)}
          data-testid="expanded"
          textValue="menu1"
          title={
            <ListboxComponent
              activeItem={activeItem}
              customKey={customKey}
              description={description}
              icon={icon}
              showDivider={true}
              title={title}
              topTitle={topTitle}
              onAction={() => handleActionListbox(path, customKey)}
            />
          }
          onPress={() => handleActionListbox(path, customKey)}
        >
          {subMenu && subMenu.length > 0 && renderSubMenu(subMenu)}
        </AccordionItem>
      );
    };

    return (
      <Card className="max-w-[340px] border-small rounded-small border-default-200 dark:border-default-100 mb-3">
        <CardHeader className="justify-center">
          <QuickInformation
            fullName={fullName}
            identityCard={identityCard}
            personAffiliateData={personAffiliateData}
          />
        </CardHeader>
        <Divider />
        <CardBody>
          <Accordion
            isCompact
            itemClasses={itemClasses}
            selectedKeys={createExpandedKeySet(expandedKey)}
            showDivider={false}
            onSelectionChange={handleSelectionChange}
          >
            {sidebarItems
              .slice(0, 2)
              .map((item) => renderAccordionItem(item))
              .filter((item) => item !== null)}
          </Accordion>
        </CardBody>
      </Card>
    );
  };

  return (
    <>
      <PersonCard />
      {sidebarItems.slice(2).map((sidebarItem: Omit<SidebarItem, "handleAction">, index: number) => {
        const { customKey, ...props } = sidebarItem;

        return (
          <AccordionComponent
            key={index}
            activeItem={activeItem}
            customKey={customKey}
            handleAction={handleAction}
            selectedPath={selectedPath}
            setActiveItem={setActiveItem}
            {...props}
          />
        );
      })}
    </>
  );
}
