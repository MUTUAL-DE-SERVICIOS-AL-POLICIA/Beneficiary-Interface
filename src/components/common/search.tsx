"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";

import { SearchIcon } from "@/components";

interface Props {
  searchPerson: (value: string, type: string) => Promise<any>;
}

export function Search({ searchPerson }: Props) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTab, setSelectedTab] = useState<any>("affiliate");
  const hasText = value.trim().length > 0;

  const buttonColor = hasText || isFocused ? "success" : "default";
  const buttonVariant =
    hasText && isFocused ? "flat" : !hasText && isFocused ? "bordered" : hasText ? "flat" : "bordered";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasText) return;

    const response = await searchPerson(String(value), String(selectedTab));

    const { error, message, data } = response;

    if (error) {
      addToast({
        title: "Búsqueda terminada",
        description: message,
        color: "warning",
        timeout: 4500,
        shouldShowTimeoutProgress: true,
      });

      return;
    }

    addToast({
      title: "Búsqueda terminada",
      description: message,
      color: "success",
      timeout: 4500,
      shouldShowTimeoutProgress: true,
    });

    router.push(`/persons/${data.uuidColum}`);

    return;
  };

  const placeholder = selectedTab === "affiliate" ? "Buscar por NUP" : "Buscar por C.I.";

  return (
    <Form onSubmit={onSubmit}>
      <div className="flex">
        <div className="rounded-l-2xl overflow-hidden border border-default-300 border-r-0">
          <Tabs
            aria-label="Options"
            color="success"
            radius="lg"
            size="sm"
            variant="bordered"
            onSelectionChange={setSelectedTab}
          >
            <Tab key="affiliate" title="NUP" />
            <Tab key="person" title="C.I." />
          </Tabs>
        </div>

        <div className="flex rounded-r-lg overflow-hidden border border-default-300 border-l-0">
          <Input
            isClearable
            autoComplete="off"
            className="h-full w-40"
            classNames={{
              inputWrapper: "h-full flex items-center border-none bg-transparent",
              input: "text-sm",
            }}
            name="text"
            placeholder={placeholder}
            radius="none"
            spellCheck="false"
            value={value}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            onValueChange={setValue}
          />

          <Button
            isIconOnly
            className="h-full border-none border-l"
            color={buttonColor}
            isDisabled={!hasText}
            radius="none"
            type="submit"
            variant={buttonVariant}
          >
            <SearchIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Form>
  );
}
