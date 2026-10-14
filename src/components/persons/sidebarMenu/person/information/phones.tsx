"use client";

import { Button, Tooltip, Drawer } from "@heroui/react";
import { useState } from "react";

import { InputCustom } from "@/components";
import { ContactsCellPhoneIcon, ContactsPhoneIcon } from "@/components";

interface PhoneDisplayProps {
  label: string;
  phoneNumbers: string[];
  labelDrawer?: string;
}

export function PhonesDrawer({ label, phoneNumbers, labelDrawer = "Teléfonos" }: PhoneDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onOpenChange = (open: boolean) => setIsOpen(open);

  const hasNumbers = phoneNumbers.length > 0;
  const firstNumber = hasNumbers ? phoneNumbers[0] : "";

  return (
    <>
      <div className="flex items-end gap-2">
        <InputCustom isCopy={hasNumbers} label={label} value={firstNumber} />

        <Tooltip>
          <div>
            <Button
              isIconOnly
              className="border hover:border-gray-500 dark:hover:border-green-800"
              size="md"
              variant="secondary"
              onPress={onOpen}
            >
              {labelDrawer === "Celulares" ? <ContactsCellPhoneIcon /> : <ContactsPhoneIcon />}
            </Button>
          </div>
          <Tooltip.Content showArrow placement="bottom">
            <Tooltip.Arrow />
            <p>Ver todos</p>
          </Tooltip.Content>
        </Tooltip>
      </div>

      <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.Header className="text-lg font-semibold">
              <Drawer.Heading>{labelDrawer}</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              {hasNumbers ? (
                <div className="flex flex-col gap-3">
                  {phoneNumbers.map((number, idx) => (
                    <InputCustom key={idx} value={number} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No hay números registrados</p>
              )}
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
}
