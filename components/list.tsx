import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { ReactNode } from "react";

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

  const cssListboxSection = {
    base: "",
    heading: "text-default-700 pb-0 mb-0",
    divider: "h-[2px] bg-default-500 ml-3",
  };

  const cssListboxItem = "m-0 p-0";

  const cssGeneral = {
    base: "",
    title: "mt-0 mb-2 font-bold text-medium ",
    trigger: "",
    indicator: "text-medium",
  };

  const getListboxClasses = (customKey: string | number): string =>
    `${cssGeneral.title}
      ${cssGeneral.trigger}
      px-3 py-0 h-14 my-0 rounded-small
      ${activeItem === customKey ? "bg-default-300" : "bg-default-100"}
    `;

  return (
    <Listbox
      variant="flat"
      aria-label="list box"
      className={getListboxClasses(customKey)}
      onAction={onAction}
    >
      <ListboxSection showDivider={showDivider} classNames={cssListboxSection} title={topTitle}>
        <ListboxItem
          key={customKey}
          className={cssListboxItem}
          description={description}
          startContent={icon}
          title={title}
        />
      </ListboxSection>
    </Listbox>
  );
};
