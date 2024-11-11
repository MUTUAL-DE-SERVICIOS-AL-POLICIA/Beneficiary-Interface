import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Card, CardBody } from '@nextui-org/card';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import { SidebarItem } from '@/config/static';

export const AccordionComponent = (sidebarItem: SidebarItem) => {
  const { selectedPath, handleSelection } = sidebarItem
  const itemClasses = {
    base: 'py-1 my-0 overflow-hidden',
    title: 'my-0 font-bold text-medium',
    trigger: 'px-2 py-10 bg-default-100 data-[open=true]:bg-default-300 data-[hover=true]:bg-default-200 h-14 flex items-center rounded-small',
    indicator: 'text-medium',
    content: 'text-small',
  };

  const classNames = {
    title: 'text-small text-default-400',
    description: 'font-semibold text-xs text-default-500',
    selectedIcon: 'primary',
  };

  const itemClassesSection = {
    base: "",
    list: "mb-0",
    heading: "text-default-700 pb-0 mb-0",
  }

  return (
    <Card className="max-w-[340px] border-small rounded-small border-default-200 dark:border-default-200 mb-3">
      <CardBody>
        <Accordion isCompact showDivider={false} itemClasses={itemClasses}>
          <AccordionItem
            key={"AccordionItem" + sidebarItem.customKey}
            textValue="procedures"
            title={
              <Listbox variant="flat" aria-label="listbox menu with section">
                <ListboxSection title={sidebarItem.topTitle}
                  classNames={itemClassesSection}
                >
                  <ListboxItem
                    key={"ListboxItem" + sidebarItem.customKey}
                    description={sidebarItem.description}
                    startContent={sidebarItem.icon}
                    className="m-0 p-0"
                    // onClick={() => handleSelection(sidebarItem.path)}
                  >
                    {sidebarItem.title}
                  </ListboxItem>
                </ListboxSection>
              </Listbox>
            }
            onPress={() => handleSelection(sidebarItem.path)}
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
