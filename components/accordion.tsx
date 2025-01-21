import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Card, CardBody } from "@nextui-org/card";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { useState } from "react";

import { SidebarItem } from "@/config/static";
import { ListboxComponent } from "./list";

export const AccordionComponent = (sidebarItem: SidebarItem) => {
  const { handleAction, activeItem, setActiveItem } = sidebarItem;

  const [expandedKey, setExpandedKey] = useState<string | number | null>(null);

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
    setExpandedKey((prevKey) => (prevKey === key ? null : key));
  };

  const handleSelectionChange = (keys: Set<any>) => {
    const key = Array.from(keys)[0];
    if (key !== undefined) {
      setExpandedKey(key.toString() || null);
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

  const handleActionListbox = (path, customKey) => {
    handleAction(path);
    setActiveItem(customKey);
    toggleItem(customKey);
  };

  const renderSubMenu = (subMenu: any[]): JSX.Element => (
    <Listbox aria-label="sub listbox" defaultSelectedKeys="all" variant="flat">
      <ListboxSection>
        {subMenu.map(({ key, icon, path, title, description }) => (
          <ListboxItem
            key={key}
            endContent={icon}
            classNames={classNames}
            description={description}
            onClick={() => handleAction(path)}
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
            icon={icon}
            title={title}
            topTitle={topTitle}
            showDivider={true}
            customKey={customKey}
            activeItem={activeItem}
            description={description}
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
          showDivider={false}
          itemClasses={itemClasses}
          onSelectionChange={handleSelectionChange}
          selectedKeys={createExpandedKeySet(expandedKey)}
        >
          {renderAccordionItem(sidebarItem)}
        </Accordion>
      </CardBody>
    </Card>
  );
};
