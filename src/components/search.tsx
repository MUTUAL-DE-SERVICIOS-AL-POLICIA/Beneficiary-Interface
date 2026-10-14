"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, SearchField, Tabs, toast } from "@heroui/react";

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
  const buttonVariant =
    hasText && isFocused
      ? "primary"
      : !hasText && isFocused
        ? "secondary"
        : hasText
          ? "primary"
          : "secondary";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasText) return;
    const response = await searchPerson(String(value), String(selectedTab));

    const { error, message, data } = response;

    if (error) {
      toast.danger("Búsqueda terminada", {
        description: message,
      });

      return;
    }

    toast.success("Búsqueda terminada", {
      description: "Buscar persona",
    });

    router.push(`/persons/${data.uuidColum}`);

    return;
  };

  const placeholder = selectedTab === "affiliate" ? "Buscar por NUP" : "Buscar por C.I.";

  return (
    <Form onSubmit={onSubmit}>
      <div className="flex">
        <div className="rounded-l-3xl overflow-hidden border border-default-300 border-r-0">
          <Tabs className="w-full max-w-md" onSelectionChange={setSelectedTab}>
            <Tabs.ListContainer>
              <Tabs.List aria-label="Options">
                <Tabs.Tab id="affiliate">
                  NUP
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="person">
                  C.I.
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>
        </div>

        <div className="flex rounded-r-3xl overflow-hidden border border-default-300 border-l-0">
          <SearchField aria-label="Buscar beneficiario" className="w-full" name="search">
            <SearchField.Group className="h-full w-full rounded-l-none rounded-r-none">
              <SearchField.Input
                className="w-40"
                name="text"
                placeholder={placeholder}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
              />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <Button
            isIconOnly
            className="border-none rounded-none h-full"
            isDisabled={!hasText}
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
