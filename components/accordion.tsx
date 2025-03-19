import { Accordion, AccordionItem } from "@heroui/accordion";
import { Card, CardBody } from "@heroui/card";
import { Listbox, ListboxItem, ListboxSection } from "@heroui/listbox";
import { useState } from "react";

import { SidebarItem } from "@/config/static";
import { ListboxComponent } from "@/components/list";

export const AccordionComponent = (sidebarItem: SidebarItem) => {
  const { handleAction, activeItem, setActiveItem } = sidebarItem;

  const [expandedKey, setExpandedKey] = useState<string | number>("");

  const itemClasses = {
    base: "",
    title: "mt-0 mb- 2 font-bold text-medium",
    trigger: "",
    indicator: "text-medium",
  };

  const classNames = {
    title: "text-small text-default-700",
    description: "font-semibold text-xs text-default-500",
    selectedIcon: "primary",
  };

  const toggleItem = (key: string | number) => {
    setExpandedKey((prevKey) => (prevKey === key ? "" : key));
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
      mb-3 mt-0 pt-0 pb-3
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

  const renderAccordionItem = (item: SidebarItem): any => {
    const { title, customKey, path, subMenu, description, icon, topTitle } = item;

    return (
      <AccordionItem
        key={customKey}
        className={getAccordionItemClasses(customKey)}
        textValue="menu-procedures"
        title={
          <ListboxComponent
            activeItem={activeItem ?? ""}
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
    <Card className="max-w-[340px] border-small rounded-small border-default-200 dark:border-default-200 mb-3">
      <CardBody>
        <Accordion
          isCompact
          itemClasses={itemClasses}
          selectedKeys={createExpandedKeySet(expandedKey)}
          showDivider={false}
          onSelectionChange={handleSelectionChange}
        >
          {renderAccordionItem(sidebarItem)}
        </Accordion>
      </CardBody>
    </Card>
  );
};
