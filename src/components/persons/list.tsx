import type { ReactNode } from "react";

import { Description, Header, Label, ListBox, Separator } from "@heroui/react";

interface ListboxProps {
  customKey: string | number;
  topTitle: string;
  description: string;
  icon: ReactNode;
  title: string;
  onAction?: () => void;
  showDivider?: boolean;
  activeItem: string | number;
}

export const ListboxComponent = (props: ListboxProps) => {
  const { customKey, topTitle, description, icon, title, onAction, showDivider, activeItem } = props;

  return (
    <ListBox aria-label={topTitle} className="w-full p-0" selectionMode="none" onAction={onAction}>
      <ListBox.Section className="m-0 h-15 p-0">
        <Header className="text-default-700">{topTitle}</Header>
        <ListBox.Item
          className={`m-0 rounded-small px-3 py-0 ${
            activeItem === customKey ? "bg-default-300" : "bg-default-100"
          }`}
          id={customKey}
          textValue={title}
        >
          {icon}
          <div className="flex min-w-0 flex-col">
            <Label className="text-medium font-bold">{title}</Label>
            <Description>{description}</Description>
          </div>
          <ListBox.ItemIndicator />
        </ListBox.Item>
      </ListBox.Section>
      {showDivider && <Separator className="ml-3 h-0.5 bg-default-500" />}
    </ListBox>
  );
};
