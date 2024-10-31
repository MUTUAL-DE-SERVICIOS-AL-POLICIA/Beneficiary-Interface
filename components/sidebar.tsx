'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Avatar } from '@nextui-org/avatar';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import fullName from '@/helpers/utils';
import { sidebarConfig, SidebarItem } from '@/config/static';
import { AccordionComponent } from '@/components/accordion';
import { getBeneficiary } from '@/app/beneficiary/service';

export default function Sidebar() {
  const { id } = useParams();

  const router = useRouter()

  const [beneficiary, setBeneficiary] = useState<any>({});
  const [ activePath, setActivePath ] = useState('')

  useEffect(() => {
    try {
      getBeneficiary(`${id}`).then((response: any) => {
        setBeneficiary(response)
      })
      .catch((error:any) => {
        throw error
      })
    } catch (e) {
      console.log(e);
    }
  }, []);

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
    router.push(`/beneficiary/${id}/${path}`)
  }

  return (
    <>
      <Card className="max-w-[340px] border-small rounded-small border-default-200 dark:border-default-100 mb-3">
        <CardHeader className="justify-between">
          <div className="flex gap-5 items-center justify-center my-4">
            {beneficiary && (
              <div className="flex flex-col gap-1 items-center mx-8">
                <h4 className="text-small font-semibold leading-none text-default-700">
                  SUB TENIENTE {id}
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
                    first_name: beneficiary.first_name,
                    second_name: beneficiary.second_name,
                    last_name: beneficiary.last_name,
                    mothers_last_name: beneficiary.mothers_last_name,
                  })}
                </h4>
                <div className="flex gap-1">
                  <p className="font-semibold text-default-800 text-small"> NUP: </p>
                  <p className="text-default-600 text-small">{beneficiary.id} </p>
                </div>
                <div className="flex gap-1">
                  <p className="font-semibold text-default-800 text-small"> C.I. </p>
                  <p data-testid="ci" className="text-default-600 text-small">
                    {beneficiary.identity_card}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Accordion isCompact showDivider={false} itemClasses={itemClasses}>
            {sidebarConfig.sidebarItems.slice(0, 2).map((sidebarItem: SidebarItem, index: number) => (
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
            ))}
          </Accordion>
        </CardBody>
      </Card>
      {sidebarConfig.sidebarItems.slice(2).map((sidebarItem: SidebarItem, index:number) => {
        const { customKey, ...props } = sidebarItem;
        return <AccordionComponent customKey={customKey} key={index} {...props} />;
      })}
    </>
  );
}
