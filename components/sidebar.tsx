'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Avatar } from '@nextui-org/avatar';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import fullName from '@/helpers/utils';
import { sidebarConfig, SidebarItem } from '@/config/static';
import { AccordionComponent } from '@/components/accordion';
import { useBeneficiary } from '@/context/BeneficiaryContext';

export default function Sidebar() {
  const { beneficiaryData } = useBeneficiary();

  const router = useRouter();

  const [selectedPath, setSelectedPath] = useState('');
  const [activeItem, setActiveItem] = useState<string | number>('');
  const [expandedKey, setExpandedKey] = useState<string | number | null>(null);

  const itemClasses = {
    base: '',
    title: 'mt-0 mb-2 font-bold text-medium ',
    trigger: '',
    indicator: 'text-medium',
  };

  const itemClassesSection = {
    base: '',
    heading: 'text-default-700 pb-0 mb-0',
    divider: 'h-[2px] bg-default-500 ml-3',
  };

  const handleAction = (path: string) => {
    setSelectedPath(path);
    router.push(`/beneficiary/${beneficiaryData.id}/${path}`);
  };

  const toggleItem = (key: string | number) => {
    setExpandedKey((prevKey) => (prevKey === key ? null : key));
  };

  const BeneficiaryCard = () => {
    const { beneficiaryData } = useBeneficiary();

    if (!beneficiaryData) return null;

    return (
      <Card className="max-w-[340px] border-small rounded-small border-default-200 dark:border-default-100 mb-3">
        <CardHeader className="justify-center">
          <div className="flex my-4">
            <div className="flex flex-col gap-1 items-center">
              <Avatar
                showFallback
                isBordered
                radius="md"
                size="lg"
                src="https://nextui.org/avatars/avatars1.png"
                className="my-2"
              />
              <h4 className="text-medium font-semibold leading-none text-default-800 text-pretty text-center">
                {fullName({
                  first_name: beneficiaryData.firstName,
                  second_name: beneficiaryData.secondName,
                  last_name: beneficiaryData.lastName,
                  mothers_last_name: beneficiaryData.mothersLastName,
                })}
              </h4>
              <div className="flex gap-1">
                <p className="font-semibold text-default-800 text-small">
                  {' '}
                  NUP: {beneficiaryData.personAffiliate.length}
                </p>
                <p className="text-default-600 text-small">{beneficiaryData.id}</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold text-default-800 text-small"> C.I. </p>
                <p className="text-default-600 text-small">{beneficiaryData.identityCard}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Accordion
            isCompact
            showDivider={false}
            itemClasses={itemClasses}
            selectedKeys={expandedKey ? new Set([expandedKey]) : new Set()}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0];
              key !== undefined ? setExpandedKey(key.toString() || null) : '';
            }}
          >
            {sidebarConfig.sidebarItems
              .slice(0, 2)
              .map((sidebarItem: SidebarItem, index: number) => {
                if (sidebarItem.title == 'DATOS DE POLICIA') {
                  if (
                    !beneficiaryData?.personAffiliate ||
                    beneficiaryData.personAffiliate.length !== 0
                  ) {
                    return (
                      <AccordionItem
                        key={sidebarItem.customKey}
                        title={
                          <Listbox
                            variant="flat"
                            aria-label="Listbox menu data general"
                            onAction={() => {
                              handleAction(sidebarItem.path);
                              setActiveItem(sidebarItem.customKey);
                              toggleItem(sidebarItem.customKey);
                            }}
                            className={`
                              ${itemClasses.title}
                              ${itemClasses.trigger}
                              px-3 py-0 h-14 my-0 rounded-small
                              ${
                                activeItem === sidebarItem.customKey
                                  ? 'bg-default-300'
                                  : 'bg-default-100'
                              }
                            `}
                          >
                            <ListboxSection
                              title={sidebarItem.topTitle}
                              showDivider
                              classNames={itemClassesSection}
                            >
                              <ListboxItem
                                key={'item' + sidebarItem.customKey + index.toString()}
                                description={sidebarItem.description}
                                startContent={sidebarItem.icon}
                                className={`m-0 p-0`}
                              >
                                {sidebarItem.title}
                              </ListboxItem>
                            </ListboxSection>
                          </Listbox>
                        }
                        data-testid="expanded"
                        textValue="menu1"
                        onPress={() => {
                          handleAction(sidebarItem.path);
                          setActiveItem(sidebarItem.customKey);
                          toggleItem(sidebarItem.customKey);
                        }}
                        className={`
                            ${itemClasses.base}
                            mb-3 mt-0 pt-0 pb-3 overflow-hidden
                            rounded-lg
                            ${
                              activeItem === sidebarItem.customKey
                                ? 'bg-default-300'
                                : 'bg-default-100'
                            }
                          `}
                      >
                        {sidebarItem.subMenu && sidebarItem.subMenu.length && (
                          <Listbox
                            variant="flat"
                            aria-label="sub listbox"
                            defaultSelectedKeys="all"
                            classNames={itemClassesSection}
                          >
                            <ListboxSection>
                              {sidebarItem.subMenu.map((menu) => (
                                <ListboxItem
                                  key={menu.key}
                                  endContent={menu.icon}
                                  onClick={() => handleAction(menu.path)}
                                >
                                  {menu.title}
                                </ListboxItem>
                              ))}
                            </ListboxSection>
                          </Listbox>
                        )}
                      </AccordionItem>
                    );
                  } else return null;
                } else
                  return (
                    <AccordionItem
                      key={sidebarItem.customKey}
                      data-testid="expanded"
                      textValue="menu1"
                      title={
                        <Listbox
                          variant="flat"
                          aria-label="Listbox menu data general"
                          onAction={() => {
                            handleAction(sidebarItem.path);
                            setActiveItem(sidebarItem.customKey);
                            toggleItem(sidebarItem.customKey);
                          }}
                          className={`
                            ${itemClasses.title}
                            ${itemClasses.trigger}
                            px-3 py-0 h-14 my-0 rounded-small
                            ${
                              activeItem === sidebarItem.customKey
                                ? 'bg-default-200'
                                : 'bg-default-100'
                            }
                          `}
                        >
                          <ListboxSection
                            title={sidebarItem.topTitle}
                            showDivider
                            classNames={itemClassesSection}
                          >
                            <ListboxItem
                              key={'item' + sidebarItem.customKey + index.toString()}
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
                        handleAction(sidebarItem.path);
                        setActiveItem(sidebarItem.customKey);
                      }}
                      className={`
                        ${itemClasses.base}
                        mb-3 mt-0 pt-0 pb-3
                        rounded-lg
                        ${
                          activeItem === sidebarItem.customKey ? 'bg-default-200' : 'bg-default-100'
                        }
                      `}
                    >
                      {sidebarItem.subMenu && sidebarItem.subMenu.length && (
                        <Listbox variant="flat" aria-label="sub listbox" defaultSelectedKeys="all">
                          <ListboxSection>
                            {sidebarItem.subMenu.map((menu) => (
                              <ListboxItem
                                key={menu.key}
                                endContent={menu.icon}
                                onClick={() => handleAction(menu.path)}
                              >
                                {menu.title}
                              </ListboxItem>
                            ))}
                          </ListboxSection>
                        </Listbox>
                      )}
                    </AccordionItem>
                  );
              })
              .filter((item) => item !== null)}
          </Accordion>
        </CardBody>
      </Card>
    );
  };

  return (
    <>
      <BeneficiaryCard />
      {sidebarConfig.sidebarItems.slice(2).map((sidebarItem: SidebarItem, index: number) => {
        const { customKey, ...props } = sidebarItem;
        return (
          <AccordionComponent
            customKey={customKey}
            key={index}
            selectedPath={selectedPath}
            handleSelection={handleAction}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            {...props}
          />
        );
      })}
    </>
  );
}
