import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/drawer";
import { useDisclosure } from "@heroui/modal";

import { ContactsPhoneIcon, ContactsCellPhoneIcon } from "@/components/common/icons";
import { InputCustom } from "@/components/common";

interface PhoneDisplayProps {
  label: string;
  phoneNumbers: string[];
  labelDrawer?: string;
}

export function PhonesDrawer({ label, phoneNumbers, labelDrawer = "Telefonos" }: PhoneDisplayProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const hasNumbers = phoneNumbers.length > 0;
  const firstNumber = hasNumbers ? phoneNumbers[0] : "";

  return (
    <>
      <div className="flex items-end gap-2">
        <InputCustom isCopy={hasNumbers} label={label} value={firstNumber} />

        <Tooltip content="Ver todos" placement="bottom">
          <div>
            <Button
              isIconOnly
              className="border hover:border-gray-500 dark:hover:border-green-800"
              size="md"
              variant="faded"
              onPress={onOpen}
            >
              {labelDrawer === "Celulares" ? <ContactsCellPhoneIcon /> : <ContactsPhoneIcon />}
            </Button>
          </div>
        </Tooltip>
      </div>

      <Drawer backdrop="opaque" isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="w-[20%]">
          {() => (
            <>
              <DrawerHeader className="text-lg font-semibold">{labelDrawer}</DrawerHeader>
              <DrawerBody>
                {hasNumbers ? (
                  <div className="flex flex-col gap-3">
                    {phoneNumbers.map((number, idx) => (
                      <InputCustom key={idx} value={number} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No hay números registrados</p>
                )}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
