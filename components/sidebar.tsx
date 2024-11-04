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

  const { beneficiaryData } = useBeneficiary()

  const router = useRouter()

  const [activePath, setActivePath] = useState('')

  const itemClasses = {
    base: 'py-1 my-0 overflow-hidden',
    title: 'my-0 font-bold text-medium',
    trigger: 'px-2 py-10 bg-default-100 data-[open=true]:bg-default-200 data-[hover=true]:bg-default-200 h-14 flex items-center rounded-small',
    indicator: 'text-medium',
    content: 'text-small',
  };

  const itemClassesSection = {
    base: "",
    list: "mb-0",
    heading: "text-slate-700 pb-0 mb-0",
  }

  const handleAction = (path: string) => {
    setActivePath(path);
    router.push(`/beneficiary/${beneficiaryData.id}/${path}`)
  }

  return (
    <>
      <Card className="max-w-[340px] border-small rounded-small border-default-200 dark:border-default-100 mb-3">
        <CardHeader className="justify-between">
          <div className="flex gap-5 items-center justify-center my-4">
            {beneficiaryData && (
              <div className="flex flex-col gap-1 items-center mx-8">
                <h4 className="text-small font-semibold leading-none text-default-700">
                  SUB TENIENTE {beneficiaryData.firstName}
                </h4>
                <Avatar
                  showFallback
                  isBordered
                  radius="md"
                  size="lg"
                  src="https://nextui.org/avatars/avatars1.png"
                  className="my-2"
                />
                <h4 className="text-small font-semibold leading-none text-default-800 text-pretty text-center">
                  {fullName({
                    first_name: beneficiaryData.firstName,
                    second_name: beneficiaryData.secondName,
                    last_name: beneficiaryData.lastName,
                    mothers_last_name: beneficiaryData.mothersLastName,
                  })}
                </h4>
                <div className="flex gap-1">
                  <p className="font-semibold text-default-800 text-small"> NUP: </p>
                  <p className="text-default-600 text-small">{beneficiaryData.id} </p>
                </div>
                <div className="flex gap-1">
                  <p className="font-semibold text-default-800 text-small"> C.I. </p>
                  <p data-testid="ci" className="text-default-600 text-small">
                    {beneficiaryData.identityCard}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Accordion isCompact showDivider={false} itemClasses={itemClasses}>
            {sidebarConfig.sidebarItems.slice(0, 2).map((sidebarItem: SidebarItem, index: number) => {
              if (sidebarItem.title == 'DATOS DE POLICIA') {
                if (beneficiaryData.personAffiliate && beneficiaryData.personAffiliate.length > 0) {
                  return (
                    <AccordionItem
                      key={"person" + sidebarItem.customKey + index.toString()}
                      data-testid="expanded"
                      textValue="menu1"
                      title={
                        <Listbox
                          variant="flat"
                          aria-label="Listbox menu data general"
                        >
                          <ListboxSection
                            title={sidebarItem.topTitle}
                            showDivider
                            classNames={itemClassesSection}
                          >
                            <ListboxItem
                              key={"item" + sidebarItem.customKey + index.toString()}
                              description={sidebarItem.description}
                              startContent={sidebarItem.icon}
                              className="m-0 p-0"
                              onClick={() => handleAction(sidebarItem.path)}
                            >
                              {sidebarItem.title}
                            </ListboxItem>
                          </ListboxSection>
                        </Listbox>
                      }
                      onPress={() => handleAction(sidebarItem.path)}
                    >
                      {sidebarItem.subMenu && sidebarItem.subMenu.length && (
                        <Listbox
                          variant="flat"
                          aria-label="sub listbox"
                          defaultSelectedKeys="all"
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
                  )
                } else return null
              } else
                return (
                  <AccordionItem
                    key={"person" + sidebarItem.customKey + index.toString()}
                    data-testid="expanded"
                    textValue="menu1"
                    title={
                      <Listbox
                        variant="flat"
                        aria-label="Listbox menu data general"
                      >
                        <ListboxSection
                          title={sidebarItem.topTitle}
                          showDivider
                          classNames={itemClassesSection}
                        >
                          <ListboxItem
                            key={"item" + sidebarItem.customKey + index.toString()}
                            description={sidebarItem.description}
                            startContent={sidebarItem.icon}
                            className="m-0 p-0"
                            onClick={() => handleAction(sidebarItem.path)}
                          >
                            {sidebarItem.title}
                          </ListboxItem>
                        </ListboxSection>
                      </Listbox>
                    }
                    onPress={() => handleAction(sidebarItem.path)}
                  >
                    {sidebarItem.subMenu && sidebarItem.subMenu.length && (
                      <Listbox
                        variant="flat"
                        aria-label="sub listbox"
                        defaultSelectedKeys="all"
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
                )
            }).filter(item => item !== null)}
          </Accordion>
        </CardBody>
      </Card>
      {sidebarConfig.sidebarItems.slice(2).map((sidebarItem: SidebarItem, index: number) => {
        const { customKey, ...props } = sidebarItem;
        return <AccordionComponent customKey={customKey} key={index} {...props} />;
      })}
    </>
  );
}
