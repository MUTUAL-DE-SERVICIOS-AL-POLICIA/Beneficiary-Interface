import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Card, CardBody } from '@nextui-org/card';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import { SidebarItem } from '@/config/static';
import { useState } from 'react';

export const AccordionComponent = (sidebarItem: SidebarItem) => {
  const { selectedPath, handleSelection, activeItem, setActiveItem } = sidebarItem;

  const [expandedKey, setExpandedKey] = useState<string | number | null>(null);

  const itemClasses = {
    base: '',
    title: 'my-0 font-bold text-medium',
    trigger: '',
    indicator: 'text-medium',
  };

  const classNames = {
    title: 'text-small text-default-400',
    description: 'font-semibold text-xs text-default-500',
    selectedIcon: 'primary',
  };

  const toggleItem = (key: string | number) => {
    setExpandedKey((prevKey) => (prevKey === key ? null : key));
  };

  return (
    <Card className="max-w-[340px] border-small rounded-small border-default-200 dark:border-default-200 mb-3">
      <CardBody>
        <Accordion
          isCompact
          showDivider={false}
          itemClasses={itemClasses}
          selectedKeys={expandedKey ? new Set([expandedKey]) : new Set()}
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0];
            setExpandedKey(key.toString() || null);
          }}
        >
          <AccordionItem
            key={'AccordionItem' + sidebarItem.customKey}
            textValue="procedures"
            title={
              <Listbox
                variant="flat"
                aria-label="listbox menu with section"
                onAction={() => {
                  handleSelection(sidebarItem.path);
                  setActiveItem(sidebarItem.customKey);
                  toggleItem(sidebarItem.customKey);
                }}
                className={`
                  ${itemClasses.title}
                  ${itemClasses.trigger}
                  px-3 py-0 h-14 my-0 rounded-small
                  transition duration-300 ease-in-out
                  ${activeItem === sidebarItem.customKey ? 'bg-default-300' : 'bg-default-100'}
                `}
              >
                <ListboxSection title={sidebarItem.topTitle}>
                  <ListboxItem
                    key={'ListboxItem' + sidebarItem.customKey}
                    description={sidebarItem.description}
                    startContent={sidebarItem.icon}
                    className="m-0 p-0"
                  >
                    {sidebarItem.title}
                  </ListboxItem>
                </ListboxSection>
              </Listbox>
            }
            onPress={() => {
              handleSelection(sidebarItem.path);
              setActiveItem(sidebarItem.customKey);
              toggleItem(sidebarItem.customKey);
            }}
            className={`
              ${itemClasses.base}
              mb-3 mt-0 pt-0 pb-3 overflow-hidden
              rounded-lg transition duration-300 ease-in-out
              ${activeItem === sidebarItem.customKey ? 'bg-default-300' : 'bg-default-100'}
            `}
          >
            {sidebarItem.subMenu && sidebarItem.subMenu.length && (
              <Listbox variant="flat" aria-label="sub listbox">
                <ListboxSection>
                  {sidebarItem.subMenu.map((menu) => (
                    <ListboxItem
                      key={menu.key}
                      title={menu.topTitle}
                      description={menu.title}
                      endContent={menu.icon}
                      classNames={classNames}
                      onClick={() => handleSelection(menu.path)}
                    />
                  ))}
                </ListboxSection>
              </Listbox>
            )}
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  );
};
